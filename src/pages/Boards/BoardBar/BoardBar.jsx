.import Box from '@mui/material/Box'
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
import { useDispatch } from 'react-redux'
import { deleteTemplate } from '~/redux/templates/templatesSlice'

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const openMenu = Boolean(anchorEl)
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
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InviteBoardUser boardId={board?._id} />
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
          <ListItemText>Edit Board</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>
          <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete Board</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this board? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteBoard} color="error" variant="contained">
            Delelte
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Board</DialogTitle>
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
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateBoardTitle} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BoardBar
