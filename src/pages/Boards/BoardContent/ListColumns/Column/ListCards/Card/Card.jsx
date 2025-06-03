import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import { deleteCardAPI } from '~/apis'
import { removeCardFromBoard } from '~/redux/activeBoard/activeBoardSlice'

function Card({ card }) {
  const dispatch = useDispatch()
  const confirm = useConfirm()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  const dndKitCardStyles = {
    // touchAction: 'none', // Dành cho sensor default dạng PointerSensor
    // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  const setActiveCard = () => {
    // Cập nhật data cho cái activeCard trong Redux
    dispatch(updateCurrentActiveCard(card))
    // Hiện Modal ActiveCard lên
    dispatch(showModalActiveCard())
  }

  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
        // overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
        // height: card?.FE_PlaceholderCard ? '0px' : 'unset'
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} /> }
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length &&
            <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>
          }
          {!!card?.comments?.length &&
            <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>
          }
          {!!card?.attachments?.length &&
            <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>
          }
        </CardActions>
      }
      {/* Nút xóa card */} 
      <IconButton 
        size="small"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
          '&:hover': { color: 'error.main' }
        }}
        onClick={async (event) => {
          event.stopPropagation(); // Ngăn chặn sự kiện click lan ra card
          try {
            await confirm({
              title: 'Delete Card',
              description: 'Are you sure you want to delete this card? This action cannot be undone.',
              confirmationText: 'Delete',
              cancellationText: 'Cancel',
              confirmationButtonProps: { color: 'error' }
            })

            await deleteCardAPI(card._id)
            dispatch(removeCardFromBoard(card))
            // Không cần đóng modal vì nút xóa này nằm trên card chứ không phải trong modal
            toast.success('Card deleted successfully!')
          } catch (error) {
            if (error?.message) {
              toast.error(error.message)
            } else {
              toast.error('Failed to delete card.')
            }
          }
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </MuiCard>
  )
}

export default Card
