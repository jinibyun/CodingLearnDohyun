"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod" // validation library

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const profileSchema = z.object({
  username: z.string().min(2, "닉네임은 최소 2글자 이상이어야 합니다."),
})

export default function ProfilePage() {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values) {
    toast.success("프로필 업데이트 완료!", {
      description: `닉네임: ${values.username}`,
    })
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">프로필 수정</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input placeholder="닉네임을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">저장</Button>
        </form>
      </Form>
    </div>
  )
}
