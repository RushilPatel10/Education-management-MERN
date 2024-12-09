import { Typography, Box, Breadcrumbs, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const PageHeader = ({ title, breadcrumbs }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {breadcrumbs && (
        <Breadcrumbs>
          {breadcrumbs.map((item, index) => (
            item.link ? (
              <Link
                key={index}
                component={RouterLink}
                to={item.link}
                color="inherit"
              >
                {item.text}
              </Link>
            ) : (
              <Typography key={index} color="text.primary">
                {item.text}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}
    </Box>
  )
}

export default PageHeader 