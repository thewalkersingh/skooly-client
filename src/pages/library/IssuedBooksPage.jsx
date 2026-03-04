import { useNavigate } from 'react-router-dom'
import { ArrowLeft }   from 'lucide-react'
import { Button }      from '@/components/ui/button'
import LibraryPage     from './LibraryPage'

// Convenience page that lands directly on the issues tab
export default function IssuedBooksPage() {
  const navigate = useNavigate()
  return <LibraryPage defaultTab="issues" />
}