import { useState, useEffect } from 'react'
import { Grid, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from '../../components/common/PageHeader'
import CoursesList from './CoursesList'
import CourseModal from './CourseModal'
import { fetchCourses } from '../../redux/slices/courseSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const { courses, loading } = useSelector((state) => state.courses)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  if (loading) return <LoadingSpinner />

  return (
    <>
      <PageHeader
        title="Courses"
        breadcrumbs={[{ text: 'Courses' }]}
        action={
          user.role === 'admin' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Course
            </Button>
          )
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CoursesList courses={courses} />
        </Grid>
      </Grid>

      <CourseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default Courses 