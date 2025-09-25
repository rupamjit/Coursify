import { Button } from '@/components/ui/button'
import { Edit, Edit2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='pt-2'>
      <Button variant={"primary"} asChild>
        <Link href={"/instructor/create-course"}>
        <Edit/>
        Create Course
        </Link>
      </Button>
    </div>
  )
}

export default page