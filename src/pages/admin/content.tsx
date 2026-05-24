import { useState } from 'react'
import { ConfirmDialog } from '../../components/shared/ConfirmDialog'
import { EmptyState, LoadingState } from '../../components/shared/States'
import { Button, Card, SectionHeader } from '../../components/ui/primitives'
import { useAppState } from '../../context/app-state'
import { useToast } from '../../context/toast'

export function AdminContentPage() {
  const { items, loadingItems, togglePublish } = useAppState()
  const { pushToast } = useToast()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [confirmBusy, setConfirmBusy] = useState(false)

  return (
    <Card tone="table">
      <SectionHeader eyebrow="Content Ops" title="Manage Example Content" pill={`${items.length} items`} />
      <p className="muted">Admin publish/unpublish controls for sample content.</p>

      {loadingItems && <LoadingState />}
      {!loadingItems && items.length === 0 && <EmptyState title="No content" description="Create content items from the CRUD module first." />}

      {!!items.length && (
        <div className="table-wrap admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <p className="admin-primary-cell">{item.title}</p>
                    <p className="admin-secondary-cell">Item ID: {item.id.slice(0, 8)}</p>
                  </td>
                  <td><span className="badge">{item.status}</span></td>
                  <td>{item.createdAt}</td>
                  <td>
                    <Button
                      tone="secondary"
                      type="button"
                      disabled={confirmBusy}
                      onClick={async () => {
                        setConfirmId(item.id)
                      }}
                    >
                      {item.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={confirmId !== null}
        title="Change content visibility"
        description="Publishing exposes this item in user-facing surfaces that consume published content."
        confirmLabel="Apply"
        busy={confirmBusy}
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (!confirmId) return
          setConfirmBusy(true)
          try {
            const target = items.find((item) => item.id === confirmId)
            await togglePublish(confirmId)
            pushToast(target?.status === 'draft' ? 'Content published' : 'Content unpublished')
            setConfirmId(null)
          } catch {
            pushToast('Failed to update content status')
          } finally {
            setConfirmBusy(false)
          }
        }}
      />
    </Card>
  )
}
