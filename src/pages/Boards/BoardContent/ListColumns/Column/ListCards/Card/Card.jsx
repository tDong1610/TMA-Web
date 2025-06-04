import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
// import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import { fetchBoardsAPI, deleteBoardAPI, updateBoardDetailsAPI } from '~/apis'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'

import { styled } from '@mui/material/styles'
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  const navigate = useNavigate()
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [newBoardDescription, setNewBoardDescription] = useState('')
  const [newBoardType, setNewBoardType] = useState('')
  
  // States cho dropdown menu
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuBoardId, setMenuBoardId] = useState(null)
  const openMenu = Boolean(anchorEl)

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()
  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search)
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get('page') || '1', 10)

  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    // // Fake tạm 16 cái item thay cho boards
    // // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    // setBoards([...Array(16)].map((_, i) => i))
    // // Fake tạm giả sử trong Database trả về có tổng 100 bản ghi boards
    // setTotalBoards(100)

    // Mỗi khi cái url thay đổi ví dụ như chúng ta chuyển trang, thì cái location.search lấy từ hook useLocation của react-router-dom củng thay đổi theo, đồng nghĩa hàm useEffect sẽ chạy lại và fetch lại API theo đúng page mới vì cái localtion.search đã nằm trong dependencies của useEffect
    // console.log(location.search)

    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsAPI(location.search)
      .then(updateStateData)
      .catch(error => {
        console.error('Error fetching boards:', error)
        toast.error('Failed to load boards. Please try again.')
        setBoards([]) // Optionally clear boards or set an error state
        setTotalBoards(0)
      })
  }, [location.search])

  const afterCreateNewBoard = () => {
    // Đơn giản là cứ fetch lại danh sách board tương tự trong useEffect
    fetchBoardsAPI(location.search).then(updateStateData)
  }

  // Xử lý dropdown menu
  const handleMenuClick = (event, boardId) => {
    setAnchorEl(event.currentTarget)
    setMenuBoardId(boardId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuBoardId(null)
  }

  const handleOpenDeleteDialog = (board) => {
    setSelectedBoard(board)
    setOpenDeleteDialog(true)
    handleMenuClose() // Đóng menu khi mở dialog
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedBoard(null)
  }

  const handleOpenEditDialog = (board) => {
    setSelectedBoard(board)
    setNewBoardTitle(board.title)
    setNewBoardDescription(board.description)
    setNewBoardType(board.type)
    setOpenEditDialog(true)
    handleMenuClose() // Đóng menu khi mở dialog
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setSelectedBoard(null)
    setNewBoardTitle('')
    setNewBoardDescription('')
    setNewBoardType('')
  }

  const handleDeleteBoard = async () => {
    try {
      await deleteBoardAPI(selectedBoard._id)
      toast.success('Board deleted successfully!')
      fetchBoardsAPI(location.search).then(updateStateData)
    } catch (error) {
      toast.error('Error deleting board!')
    }
    handleCloseDeleteDialog()
  }

  const handleUpdateBoardTitle = async () => {
    if (!newBoardTitle.trim()) {
      toast.error('Please enter board title!')
      return
    }

    if (!newBoardDescription.trim()) {
      toast.error('Please enter board description!')
      return
    }

    try {
      await updateBoardDetailsAPI(selectedBoard._id, {
        title: newBoardTitle,
        description: newBoardDescription,
        type: newBoardType
      })
      toast.success('Board updated successfully!')
      fetchBoardsAPI(location.search).then(updateStateData)
      handleCloseEditDialog()
    } catch (error) {
      toast.error('Error updating board!')
    }
  }

  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem onClick={() => navigate('/templates')}>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem onClick={() => navigate('/')}>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Your boards:</Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 &&
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>No result found!</Typography>
            }

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 &&
              <Grid container spacing={2}>
                {boards.map(b =>
                  <Grid xs={2} sm={3} md={4} key={b._id}>
                    <Card sx={{ width: '250px' }}>
                      {/* Ý tưởng mở rộng về sau làm ảnh Cover cho board nhé */}
                      {/* <CardMedia component="img" height="100" image="https://picsum.photos/100" /> */}
                      <Box sx={{ height: '50px', backgroundColor: randomColor() }}></Box>

                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography gutterBottom variant="h6" component="div">
                            {b?.title}
                          </Typography>
                          {/* Thay thế 2 nút riêng biệt bằng 1 nút menu */}
                          <IconButton 
                            size="small" 
                            onClick={(event) => handleMenuClick(event, b._id)}
                            aria-label="more options"
                            aria-controls={openMenu && menuBoardId === b._id ? 'board-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMenu && menuBoardId === b._id ? 'true' : undefined}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {b?.description}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/boards/${b._id}`}
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            '&:hover': { color: 'primary.light' }
                          }}>
                          Go to board <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            }

            {/* Dropdown Menu */}
            <Menu
              id="board-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'board-menu-button',
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => {
                const board = boards.find(b => b._id === menuBoardId)
                if (board) handleOpenEditDialog(board)
              }}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Board</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                const board = boards.find(b => b._id === menuBoardId)
                if (board) handleOpenDeleteDialog(board)
              }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete Board</ListItemText>
              </MenuItem>
            </Menu>

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {(totalBoards > 0) &&
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  // Giá trị của page hiện tại đang đứng
                  page={page}
                  // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            }
          </Grid>
        </Grid>
      </Box>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Board</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              label="Board Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
            />
            <TextField
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={newBoardDescription}
              onChange={(e) => setNewBoardDescription(e.target.value)}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Board Type:</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={newBoardType === 'public' ? 'contained' : 'outlined'}
                  onClick={() => setNewBoardType('public')}
                  startIcon={<LockOpenIcon />}
                >
                  Public
                </Button>
                <Button
                  variant={newBoardType === 'private' ? 'contained' : 'outlined'}
                  onClick={() => setNewBoardType('private')}
                  startIcon={<LockIcon />}
                >
                  Private
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateBoardTitle} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this board? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteBoard} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Boards