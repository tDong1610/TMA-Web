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
  const [anchorEl, setAnchorEl] = useState(null)
  const [openTypeDialog, setOpenTypeDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const openMenu = Boolean(anchorEl)
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  // Handler mẫu cho các action
  const handleRenameBoard = () => {
    handleCloseMenu()
    alert('Sửa tên bảng') // Sau này bạn có thể mở modal nhập tên mới ở đây
  }

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
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        {/* <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        /> */}
        <Chip
          sx={MENU_STYLES}
          icon={<SettingsIcon />}
          label="Setting"
          clickable
          onClick={handleOpenMenu}
        />

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <MenuItem onClick={handleRenameBoard}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Rename Board
          </MenuItem>
          <MenuItem onClick={() => setOpenDeleteDialog(true)}>
            <DeleteForeverIcon fontSize="small" sx={{ mr: 1 }} /> Delete Board
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
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Xử lý mời user vào làm thành viên của board */}
        <InviteBoardUser boardId={board._id} />

        {/* Xử lý hiển thị danh sách thành viên của board */}
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>

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

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this board? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // TODO: Gọi API hoặc function để xóa board tại đây
              console.log('Deleting board...')
              setOpenDeleteDialog(false)
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BoardBar
