import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { uploadCardAttachmentAPI } from '~/apis'

function CardAttachments({ cardId, attachments = [], onAttachmentAdded, onAttachmentDeleted }) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event) => {
    const file = event.target?.files?.[0]
    if (!cardId) {
      toast.error('Card ID is missing. Cannot upload file.');
      setIsUploading(false);
      event.target.value = ''; // Reset input
      return;
    }
    if (!file) return

    setIsUploading(true)
    try {
      const response = await uploadCardAttachmentAPI(cardId, file)
      onAttachmentAdded(response)
      toast.success('File uploaded successfully!')
    } catch (error) {
      toast.error(error?.message || 'Failed to upload file')
    } finally {
      setIsUploading(false)
      event.target.value = '' // Reset input
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Attachments</Typography>
      
      <Button
        variant="contained"
        component="label"
        disabled={isUploading}
        sx={{ mb: 2 }}
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
        <input
          type="file"
          hidden
          onChange={handleFileUpload}
        />
      </Button>

      {attachments.length > 0 && (
        <List>
          {attachments.map((attachment, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onAttachmentDeleted(attachment._id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {attachment.name}
                  </a>
                }
                secondary={
                  <Typography component="span" variant="body2" color="text.secondary">
                    {`${(attachment.size / 1024).toFixed(2)} KB`}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default CardAttachments 