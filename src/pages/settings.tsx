import { useEffect, useState } from 'react'
import { ErrorState, FormSkeleton } from '../components/shared/States'
import { Button, Card, Input, SectionHeader, Select, Textarea } from '../components/ui/primitives'
import { useToast } from '../context/toast'
import { api } from '../lib/api'

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

  return (
    <Card>
      <SectionHeader eyebrow="Preferences" title="User Settings" />
      <form
        className="grid"
        style={{ marginTop: '.8rem' }}
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
        <label>
          Display Name
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Timezone
          <Select value={timezone} onChange={(event) => setTimezone(event.target.value)}>
            <option>Asia/Singapore</option>
            <option>UTC</option>
            <option>America/Los_Angeles</option>
          </Select>
        </label>
        <label>
          Bio
          <Textarea rows={4} value={bio} onChange={(event) => setBio(event.target.value)} />
        </label>
        <p className="muted">{bio.length}/280 characters</p>
        {saveError ? <p className="field-error">{saveError}</p> : null}
        <Button type="submit" disabled={saveBusy}>{saveBusy ? 'Saving...' : 'Save settings'}</Button>
      </form>
    </Card>
  )
}
