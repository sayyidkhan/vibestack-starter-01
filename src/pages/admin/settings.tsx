import { useEffect, useMemo, useState } from 'react'
import { ErrorState, FormSkeleton } from '../../components/shared/States'
import { Card, SectionHeader } from '../../components/ui/primitives'
import { useToast } from '../../context/toast'
import { api, type AppSetting, type FeatureFlag } from '../../lib/api'

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSetting[] | null>(null)
  const [flags, setFlags] = useState<FeatureFlag[] | null>(null)
  const [error, setError] = useState('')
  const [busyControl, setBusyControl] = useState<string | null>(null)
  const { pushToast } = useToast()

  useEffect(() => {
    Promise.all([api.adminListSettings(), api.adminListFeatureFlags()])
      .then(([settingsResult, flagsResult]) => {
        setSettings(settingsResult)
        setFlags(flagsResult)
      })
      .catch(() => setError('Unable to load settings'))
  }, [])

  const allowSignup = useMemo(
    () => settings?.find((setting) => setting.key === 'allow_signup')?.value === 'true',
    [settings],
  )

  const aiEnabled = useMemo(
    () => settings?.find((setting) => setting.key === 'ai_enabled')?.value === 'true',
    [settings],
  )

  const updateSetting = async (key: string, value: boolean) => {
    setBusyControl(`setting:${key}`)
    try {
      const updated = await api.adminUpdateSetting(key, value ? 'true' : 'false')
      setSettings((prev) => (prev ? prev.map((s) => (s.id === updated.id ? updated : s)) : prev))
      pushToast(`Updated ${key}`)
    } catch {
      pushToast(`Failed to update ${key}`)
    } finally {
      setBusyControl(null)
    }
  }

  const updateFlag = async (key: string, enabled: boolean) => {
    setBusyControl(`flag:${key}`)
    try {
      const updated = await api.adminUpdateFeatureFlag(key, enabled)
      setFlags((prev) => (prev ? prev.map((flag) => (flag.key === key ? updated : flag)) : prev))
      pushToast(`Updated ${key}`)
    } catch {
      pushToast(`Failed to update ${key}`)
    } finally {
      setBusyControl(null)
    }
  }

  if (error) return <ErrorState message={error} />
  if (!settings || !flags) return <FormSkeleton titleWidth="36%" lines={6} />

  return (
    <Card tone="table">
      <SectionHeader eyebrow="Configuration" title="Admin Settings" pill={`${flags.length + 2} controls`} />
      <p className="muted">Manage app-wide configuration, moderation policies, and feature toggles.</p>
      <div className="admin-settings-grid" style={{ marginTop: '.8rem' }}>
        <div className="admin-settings-group">
          <p className="admin-settings-title">Core Controls</p>
          <label className="switch setting-row">
            <input
              type="checkbox"
              checked={allowSignup}
              disabled={busyControl !== null}
              onChange={async (event) => updateSetting('allow_signup', event.target.checked)}
            />
            <span>
              <strong>Enable signup</strong>
              <small>Allow self-serve account creation.</small>
            </span>
          </label>
          <label className="switch setting-row">
            <input
              type="checkbox"
              checked={aiEnabled}
              disabled={busyControl !== null}
              onChange={async (event) => updateSetting('ai_enabled', event.target.checked)}
            />
            <span>
              <strong>Enable AI provider bridge</strong>
              <small>Allow prompts to route through configured providers.</small>
            </span>
          </label>
        </div>
        <div className="admin-settings-group">
          <p className="admin-settings-title">Feature Flags</p>
          {flags.map((flag) => (
            <label key={flag.key} className="switch setting-row">
              <input
                type="checkbox"
                checked={flag.enabled}
                disabled={busyControl !== null}
                onChange={async (event) => updateFlag(flag.key, event.target.checked)}
              />
              <span>
                <strong>{flag.key}</strong>
                <small>{flag.description || 'Controls module visibility and access policy.'}</small>
              </span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  )
}
