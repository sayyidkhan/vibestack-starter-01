import { useState } from 'react'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { EmptyState, ErrorState, TableSkeleton } from '../components/shared/States'
import { Button, Card, Input, Pill, SectionHeader } from '../components/ui/primitives'
import { useAppState } from '../context/app-state'
import { useToast } from '../context/toast'

export function ItemsPage() {
  const { items, loadingItems, apiAvailable, createItem, renameItem, deleteItem, togglePublish } = useAppState()
  const { pushToast } = useToast()
  const [draftTitle, setDraftTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmPublishId, setConfirmPublishId] = useState<string | null>(null)
  const [confirmBusy, setConfirmBusy] = useState(false)

  return (
    <Card tone="table">
      <SectionHeader eyebrow="Domain Model" title="Example CRUD Items" pill={`${items.length} records`} />
      <p className="muted">Replace this with your first domain model.</p>

      {!apiAvailable && <ErrorState message="API offline. Start backend with npm run api:dev or npm run dev:full." />}

      <form
        className="row"
        style={{ marginTop: '.8rem' }}
        onSubmit={async (event) => {
          event.preventDefault()
          if (!apiAvailable) return
          setBusy(true)
          try {
            await createItem(draftTitle)
            setDraftTitle('')
            pushToast('Item created')
          } catch {
            pushToast('Failed to create item')
          } finally {
            setBusy(false)
          }
        }}
      >
        <Input
          placeholder="New item title"
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
        />
        <Button type="submit" disabled={busy || !apiAvailable}>Create</Button>
      </form>

      {loadingItems && <TableSkeleton titleWidth="38%" rows={5} />}
      {!loadingItems && items.length === 0 && apiAvailable && <EmptyState title="No items" description="Create your first item to test the workflow." />}

      <ul className="list" style={{ marginTop: '1rem' }}>
        {items.map((item) => (
          <li key={item.id} className="item-row">
            <Input
              defaultValue={item.title}
              onBlur={async (event) => {
                if (!apiAvailable) return
                try {
                  await renameItem(item.id, event.target.value)
                  pushToast('Item renamed')
                } catch {
                  pushToast('Failed to rename item')
                }
              }}
            />
            <Pill>{item.status}</Pill>
            <Button
              tone="secondary"
              type="button"
              disabled={!apiAvailable || confirmBusy}
              onClick={async () => {
                setConfirmPublishId(item.id)
              }}
            >
              {item.status === 'draft' ? 'Publish' : 'Unpublish'}
            </Button>
            <Button
              tone="secondary"
              type="button"
              disabled={!apiAvailable || confirmBusy}
              onClick={async () => {
                setConfirmDeleteId(item.id)
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={confirmPublishId !== null}
        title="Confirm status change"
        description="This will change visibility in admin content workflows."
        confirmLabel="Confirm"
        busy={confirmBusy}
        onCancel={() => setConfirmPublishId(null)}
        onConfirm={async () => {
          if (!confirmPublishId) return
          setConfirmBusy(true)
          try {
            const target = items.find((item) => item.id === confirmPublishId)
            await togglePublish(confirmPublishId)
            pushToast(target?.status === 'draft' ? 'Item published' : 'Item moved to draft')
            setConfirmPublishId(null)
          } catch {
            pushToast('Failed to update item status')
          } finally {
            setConfirmBusy(false)
          }
        }}
      />
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete item"
        description="This action cannot be undone."
        confirmLabel="Delete"
        busy={confirmBusy}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (!confirmDeleteId) return
          setConfirmBusy(true)
          try {
            await deleteItem(confirmDeleteId)
            pushToast('Item deleted')
            setConfirmDeleteId(null)
          } catch {
            pushToast('Failed to delete item')
          } finally {
            setConfirmBusy(false)
          }
        }}
      />
    </Card>
  )
}
