import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTemplates, deleteTemplate } from '~/redux/templates/templatesSlice';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import AppBarComponent from '~/components/AppBar/AppBar';

// Styled components
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
}));

function TemplatesList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates, loading, error } = useSelector((state) => state.templates);

  useEffect(() => {
    // Fetch templates when the component mounts
    dispatch(fetchTemplates());
  }, [dispatch]);

  if (loading === 'loading') {
    return <LinearProgress sx={{ mt: 2 }} />;
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 2 }}>
          Error loading templates: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBarComponent />

      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          {/* Sidebar */}
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <SidebarItem onClick={() => navigate('/boards')}>
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem className="active">
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Public Templates
            </Typography>

            {templates && templates.length > 0 ? (
              <Grid container spacing={2}>
                {templates.map((template) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={template._id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                        transition: 'all 0.3s'
                      }
                    }}>
                      <Box sx={{ 
                        height: '100px', 
                        backgroundColor: template.cover || '#1976d2',
                        backgroundImage: template.cover ? `url(${template.cover})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {template.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {template.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          endIcon={<ArrowRightIcon />}
                          onClick={() => navigate(`/boards/${template.boardId}`)}
                        >
                          Use Template
                        </Button>
                        <IconButton 
                          aria-label="delete template"
                          onClick={() => dispatch(deleteTemplate(template._id))}
                          size="small"
                          sx={{ ml: 'auto' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No templates available.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default TemplatesList;