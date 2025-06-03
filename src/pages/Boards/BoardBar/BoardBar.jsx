import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import SettingsIcon from '@mui/icons-material/Settings';
import { Tooltip } from '@mui/material'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import React, { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteBoardAPI, updateBoardDetailsAPI } from '~/apis'
import TextField from '@mui/material/TextField'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState(board?.title || '')

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true)
    handleCloseMenu()
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true)
    handleCloseMenu()
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
  }

  const handleDeleteBoard = async () => {
    try {
      await deleteBoardAPI(board._id)
      toast.success('Xóa bảng thành công!')
      navigate('/boards')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa bảng!')
    }
    handleCloseDeleteDialog()
  }

  const handleUpdateBoardTitle = async () => {
    if (!newBoardTitle.trim()) {
      toast.error('Vui lòng nhập tên bảng!')
      return
    }

    try {
      await updateBoardDetailsAPI(board._id, { title: newBoardTitle })
      toast.success('Cập nhật tên bảng thành công!')
      handleCloseEditDialog()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật tên bảng!')
    }
  }

  const [openTypeDialog, setOpenTypeDialog] = useState(false)
  const [newBoardType, setNewBoardType] = useState(board?.type)

  const handleToggleBoardType = () => {
    setNewBoardType(board?.type === 'private' ? 'public' : 'private')
    setOpenTypeDialog(true)
    handleCloseMenu()
  }

  const handleConfirmChangeType = () => {
    // Gửi API đổi type ở đây
    alert(`Changed to ${newBoardType}`)
    setOpenTypeDialog(false)
  }

  const handleCancelChangeType = () => {
    setOpenTypeDialog(false)
  }
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
          sx={{
            color: 'white',
            borderColor: 'white',
            '& .MuiChip-icon': { color: 'white' },
            '&:hover': { borderColor: 'white' }
          }}
          onClick={handleOpenMenu}
        />
        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          sx={{
            color: 'white',
            borderColor: 'white',
            '& .MuiChip-icon': { color: 'white' },
            '&:hover': { borderColor: 'white' }
          }}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
          sx={{
            color: 'white',
            borderColor: 'white',
            '& .MuiChip-icon': { color: 'white' },
            '&:hover': { borderColor: 'white' }
          }}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable
          sx={{
            color: 'white',
            borderColor: 'white',
            '& .MuiChip-icon': { color: 'white' },
            '&:hover': { borderColor: 'white' }
          }}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          sx={{
            color: 'white',
            borderColor: 'white',
            '& .MuiChip-icon': { color: 'white' },
            '&:hover': { borderColor: 'white' }
          }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<SettingsIcon />}
          label="Setting"
          clickable
          onClick={handleOpenMenu}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InviteBoardUser board={board} />
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleOpenEditDialog}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Sửa tên bảng</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>
          <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Xóa bảng</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleBoardType}>
          {board?.type === 'private' ? (
            <>
              <LockOpenIcon fontSize="small" sx={{ mr: 1 }} /> Switch to Public
            </>
          ) : (
            <>
              <LockIcon fontSize="small" sx={{ mr: 1 }} /> Switch to Private
            </>
          )}
        </MenuItem>
      </Menu>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xóa bảng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa bảng này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteBoard} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Sửa tên bảng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên bảng"
            type="text"
            fullWidth
            variant="outlined"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleUpdateBoardTitle} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTypeDialog} onClose={handleCancelChangeType}>
        <DialogTitle>Change Board Visibility</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change this board to {newBoardType.toUpperCase()}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelChangeType} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmChangeType} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BoardBar
