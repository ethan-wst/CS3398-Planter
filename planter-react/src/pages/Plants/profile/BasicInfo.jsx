import React from 'react';
import { 
  Typography, 
  Box, 
  Divider, 
  Stack, 
  TextField, 
  Button, 
  IconButton 
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { toTitleCase } from '/src/utils/plantUtils';

/**
 * Displays the basic information about a plant
 */
const BasicInfo = ({ 
  plant, 
  shareableLink, 
  comments,
  comment,
  onCommentChange,
  onAddComment,
  onCopyLink
}) => {
  if (!plant) return null;
  
  return (
    <Box>
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Basic Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="textSecondary">Name</Typography>
            <Typography variant="body1">{toTitleCase(plant.name)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Species</Typography>
            <Typography variant="body1">{toTitleCase(plant.species)}</Typography>
          </Box>
          {plant.description && (
            <Box>
              <Typography variant="caption" color="textSecondary">Description</Typography>
              <Typography variant="body1">{plant.description}</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Shareable Link
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            sx={{ 
              flex: 1,
              fontSize: "14px",
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              p: 1,
              borderRadius: 1,
              wordBreak: 'break-all'
            }}
          >
            {shareableLink}
          </Typography>
          <IconButton 
            onClick={onCopyLink}
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Comments
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {comments.length === 0 ? (
            <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
              No comments yet.
            </Typography>
          ) : (
            comments.map((c, index) => (
              <Box 
                key={index}
                sx={{ 
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  borderRadius: 1
                }}
              >
                {c}
              </Box>
            ))
          )}
        </Stack>  
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="Add a comment..."
        value={comment}
        onChange={onCommentChange}
        multiline
        rows={2}
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        onClick={onAddComment}
        sx={{ 
          mt: 1,
          backgroundColor: "#50715c",
          "&:hover": { backgroundColor: "#6b9e83" }
        }}
      >
        Add Comment
      </Button>
    </Box>
  );
};

export default BasicInfo;