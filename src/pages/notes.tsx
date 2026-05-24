import { useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { EmptyState, ErrorState, LoadingState } from '../components/shared/States'
import { Button, Card, Input, Pill, SectionHeader, Textarea } from '../components/ui/primitives'
import { useToast } from '../context/toast'
import { api, type UserNote } from '../lib/api'

function formatDate(input: string) {
  const value = new Date(input)
  if (Number.isNaN(value.getTime())) return 'Unknown'
  return value.toLocaleString()
}

export function NotesPage() {
  const { pushToast } = useToast()
  const [notes, setNotes] = useState<UserNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createTitle, setCreateTitle] = useState('')
  const [createBody, setCreateBody] = useState('')
  const [createBusy, setCreateBusy] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmBusy, setConfirmBusy] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const sortedNotes = useMemo(
    () =>
      [...notes].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }),
    [notes],
  )

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const next = await api.listNotes()
        setNotes(next)
      } catch {
        setError('Unable to load notes right now.')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <section className="grid">
      <Card>
        <SectionHeader eyebrow="User Module" title="Notes Workspace" pill={`${notes.length} notes`} />
        <p className="muted">Capture operating ideas, experiments, and action items without leaving your template app.</p>
        <form
          className="grid"
          style={{ marginTop: '.9rem' }}
          onSubmit={async (event) => {
            event.preventDefault()
            const title = createTitle.trim()
            if (!title) {
              pushToast('Title is required')
              return
            }
            setCreateBusy(true)
            try {
              const created = await api.createNote({ title, body: createBody.trim() })
              setNotes((prev) => [created, ...prev])
              setCreateTitle('')
              setCreateBody('')
              pushToast('Note created')
            } catch {
              pushToast('Failed to create note')
            } finally {
              setCreateBusy(false)
            }
          }}
        >
          <label>
            Title
            <Input
              value={createTitle}
              onChange={(event) => setCreateTitle(event.target.value)}
              placeholder="Write a concise title"
            />
          </label>
          <label>
            Body
            <Textarea
              value={createBody}
              onChange={(event) => setCreateBody(event.target.value)}
              placeholder="Add context, assumptions, and next actions"
              rows={4}
            />
          </label>
          <div className="row">
            <Button type="submit" disabled={createBusy}>
              {createBusy ? 'Creating...' : 'Add Note'}
            </Button>
          </div>
        </form>
      </Card>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && sortedNotes.length === 0 && (
        <EmptyState title="No notes yet" description="Create your first note to start building your execution memory." />
      )}

      {!loading && !error && sortedNotes.length > 0 && (
        <section className="grid notes-grid">
          {sortedNotes.map((note) => (
            <article key={note.id} className="card note-card">
              <div className="section-head">
                <Input
                  value={note.title}
                  onChange={(event) => {
                    const value = event.target.value
                    setNotes((prev) => prev.map((entry) => (entry.id === note.id ? { ...entry, title: value } : entry)))
                  }}
                  onBlur={async (event) => {
                    const title = event.target.value.trim()
                    if (!title) return
                    setBusyId(note.id)
                    try {
                      const updated = await api.updateNote(note.id, { title })
                      setNotes((prev) => prev.map((entry) => (entry.id === note.id ? updated : entry)))
                      pushToast('Title updated')
                    } catch {
                      pushToast('Failed to update title')
                    } finally {
                      setBusyId(null)
                    }
                  }}
                />
                <Pill className={note.pinned ? 'pinned' : ''}>{note.pinned ? 'Pinned' : 'Note'}</Pill>
              </div>
              <Textarea
                rows={5}
                value={note.body}
                onChange={(event) => {
                  const value = event.target.value
                  setNotes((prev) => prev.map((entry) => (entry.id === note.id ? { ...entry, body: value } : entry)))
                }}
                onBlur={async (event) => {
                  setBusyId(note.id)
                  try {
                    const updated = await api.updateNote(note.id, { body: event.target.value.trim() })
                    setNotes((prev) => prev.map((entry) => (entry.id === note.id ? updated : entry)))
                    pushToast('Body updated')
                  } catch {
                    pushToast('Failed to update body')
                  } finally {
                    setBusyId(null)
                  }
                }}
              />
              <p className="muted note-meta">Updated {formatDate(note.updatedAt)}</p>
              <div className="row">
                <Button
                  tone="secondary"
                  type="button"
                  disabled={busyId === note.id}
                  onClick={async () => {
                    setBusyId(note.id)
                    try {
                      const updated = await api.updateNote(note.id, { pinned: !note.pinned })
                      setNotes((prev) => prev.map((entry) => (entry.id === note.id ? updated : entry)))
                      pushToast(updated.pinned ? 'Note pinned' : 'Note unpinned')
                    } catch {
                      pushToast('Failed to update pin state')
                    } finally {
                      setBusyId(null)
                    }
                  }}
                >
                  {note.pinned ? 'Unpin' : 'Pin'}
                </Button>
                <Button tone="secondary" type="button" disabled={busyId === note.id} onClick={() => setConfirmDeleteId(note.id)}>
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete note"
        description="This action cannot be undone."
        confirmLabel="Delete"
        busy={confirmBusy}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (!confirmDeleteId) return
          setConfirmBusy(true)
          try {
            await api.deleteNote(confirmDeleteId)
            setNotes((prev) => prev.filter((note) => note.id !== confirmDeleteId))
            setConfirmDeleteId(null)
            pushToast('Note deleted')
          } catch {
            pushToast('Failed to delete note')
          } finally {
            setConfirmBusy(false)
          }
        }}
      />
    </section>
  )
}
