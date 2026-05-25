import { useEffect, useState } from 'react'
import { ErrorState, FormSkeleton } from '../components/shared/States'
import { Button, Card, Input, Select, Textarea } from '../components/ui/primitives'
import { useToast } from '../context/toast'
import { api } from '../lib/api'

const timezones = ['UTC', 'Asia/Singapore', 'America/Los_Angeles', 'America/New_York', 'Europe/London']

export function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [bio, setBio] = useState('')
  const [saveBusy, setSaveBusy] = useState(false)
  const [saveError, setSaveError] = useState('')
  const { pushToast } = useToast()

  useEffect(() => {
    api.getProfile().then(({ user, profile }) => {
      setName(user.name)
      setTimezone(profile?.timezone || 'UTC')
      setBio(profile?.bio || '')
      setLoading(false)
    }).catch(() => {
      setError('Unable to load settings')
      setLoading(false)
    })
  }, [])

  if (error) return <ErrorState message={error} />
  if (loading) return <FormSkeleton titleWidth="42%" lines={5} />

  const bioRemaining = 280 - bio.length

  return (
    <section className="settings-page">
      <Card className="settings-card">
        <div className="settings-hero">
          <div>
            <p className="eyebrow">Preferences</p>
            <h2>User Settings</h2>
            <p className="muted">Control how you appear in the workspace and which timezone we use for dates.</p>
          </div>
          <span className="pill">Profile & timezone</span>
        </div>

        <form
          className="settings-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setSaveError('')
            if (name.trim().length < 2) {
              setSaveError('Display name must be at least 2 characters')
              return
            }
            if (bio.length > 280) {
              setSaveError('Bio must be 280 characters or less')
              return
            }
            setSaveBusy(true)
            try {
              await api.updateProfile({ name: name.trim(), timezone, bio: bio.trim() })
              pushToast('Settings saved')
            } catch {
              setSaveError('Unable to save settings')
            } finally {
              setSaveBusy(false)
            }
          }}
        >
          <div className="settings-fields">
            <label className="settings-field">
              <span className="settings-label">Display name</span>
              <span className="settings-hint">Your name across dashboards and admin views.</span>
              <Input
                value={name}
                placeholder="Your name"
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="settings-field">
              <span className="settings-label">Timezone</span>
              <span className="settings-hint">Used for activity timestamps and scheduled views.</span>
              <Select value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                {timezones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </Select>
            </label>

            <label className="settings-field settings-field-bio">
              <span className="settings-label-row">
                <span className="settings-label">Bio</span>
                <span className={bioRemaining < 40 ? 'settings-counter warn' : 'settings-counter'}>
                  {bio.length}/280
                </span>
              </span>
              <span className="settings-hint">A short intro for your profile page.</span>
              <Textarea
                rows={4}
                value={bio}
                placeholder="Tell teammates what you are working on..."
                onChange={(event) => setBio(event.target.value)}
              />
            </label>
          </div>

          {saveError ? <p className="field-error">{saveError}</p> : null}

          <div className="settings-actions">
            <Button type="submit" className="settings-submit" disabled={saveBusy}>
              {saveBusy ? 'Saving...' : 'Save settings'}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}
