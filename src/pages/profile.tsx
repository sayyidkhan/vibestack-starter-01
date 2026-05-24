import { useEffect, useState } from 'react'
import { ErrorState, ProfileSkeleton } from '../components/shared/States'
import { api, type UserActivityItem, type UserProfile } from '../lib/api'
import type { AppUser } from '../lib/types'

export function ProfilePage() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activity, setActivity] = useState<UserActivityItem[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.getProfile(), api.getUserActivity()])
      .then(([profileResult, activityResult]) => {
        setUser(profileResult.user)
        setProfile(profileResult.profile)
        setActivity(activityResult)
      })
      .catch(() => setError('Unable to load profile'))
  }, [])

  if (error) return <ErrorState message={error} />
  if (!user || !activity) return <ProfileSkeleton />

  return (
    <section className="grid">
      <section className="card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Identity</p>
            <h2>Profile</h2>
          </div>
          <span className="pill">{user.role}</span>
        </div>
        <div className="meta-list">
          <p><strong>Name</strong><span>{user.name}</span></p>
          <p><strong>Email</strong><span>{user.email}</span></p>
          <p><strong>Timezone</strong><span>{profile?.timezone ?? 'UTC'}</span></p>
          <p><strong>Bio</strong><span>{profile?.bio || 'No bio yet'}</span></p>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <p className="eyebrow">History</p>
            <h3>Activity History</h3>
          </div>
          <span className="pill">{activity.length} events</span>
        </div>
        {activity.length === 0 && (
          <p className="muted">No activity yet. Actions from profile, CRUD, and AI will appear here.</p>
        )}
        {activity.length > 0 && (
          <ul className="list timeline">
            {activity.map((item) => (
              <li key={item.id}>
                <span className="timeline-dot" />
                <div>
                  <strong>{item.action}</strong>
                  <p className="muted">{new Date(item.at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
