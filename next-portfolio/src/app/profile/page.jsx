"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

const profileSchema = z.object({
  username: z
    .string()
    .min(2, "닉네임은 2~20자 사이여야 합니다.")
    .max(20, "닉네임은 2~20자 사이여야 합니다."),
  email: z.email("유효한 이메일 주소를 입력해주세요."),
  bio: z.string().max(160, "자기소개는 160자를 초과할 수 없습니다.").optional(),
  role: z
    .string()
    .refine((value) => ["developer", "designer", "manager"].includes(value), {
      message: "직업을 선택해주세요.",
    }),
  marketing_emails: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
})

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profileId, setProfileId] = useState(null)

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      role: "",
      marketing_emails: false,
      theme: "system",
    },
  })

  useEffect(() => {
    let isMounted = true

    async function loadUserData() {
      const { data, error } = await supabase
        .from("profiles3")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (!isMounted) {
        return
      }

      if (error) {
        console.log(error)
        toast.error("데이터를 불러오지 못했습니다")
        setIsLoading(false)
        return
      }

      form.reset(data)
      setProfileId(data.id)
      setIsLoading(false)
    }

    loadUserData()

    return () => {
      isMounted = false
    }
  }, [form])

  async function handleDelete() {
    if (!window.confirm("정말 프로필을 삭제하시겠습니까?")) {
      return
    }

    try {
      const { error } = await supabase
        .from("profiles3")
        .delete()
        .eq("id", profileId)

      if (error) {
        throw error
      }

      toast.success("프로필이 삭제되었습니다")
      form.reset({
        username: "",
        email: "",
        bio: "",
        role: "",
        marketing_emails: false,
        theme: "system",
      })
      setProfileId(null)
    } catch (error) {
      console.log(error)
      toast.error("삭제 실패", {
        description: "서버에 문제가 발생했습니다. 다시 시도해주세요.",
      })
    }
  }

  async function onSubmit(values) {
    try {
      const nextProfileId = profileId ?? crypto.randomUUID()
      const { error } = await supabase
        .from("profiles3")
        .upsert([{ ...values, id: nextProfileId }])

      if (error) {
        throw error
      }

      if (!profileId) {
        setProfileId(nextProfileId)
      }

      toast.success(profileId ? "프로필 수정 완료!" : "프로필 생성 완료!", {
        description: `이메일: ${values.email} / 직업: ${values.role}`,
      })
    } catch (error) {
      console.log(error)
      toast.error("저장 실패", {
        description: "서버에 문제가 발생했습니다. 다시 시도해주세요.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>사용자 정보를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">종합 프로필 설정</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>자기소개</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="자기소개를 입력하세요 (최대 160자)"
                    maxLength={160}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>선택 입력 항목입니다.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>직업</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="직업을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">developer</SelectItem>
                      <SelectItem value="designer">designer</SelectItem>
                      <SelectItem value="manager">manager</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketing_emails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>광고 수신</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm text-muted-foreground">마케팅 이메일 수신 동의</span>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>테마</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                  >
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-3">
                      <RadioGroupItem value="light" />
                      <span className="text-sm">light</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-3">
                      <RadioGroupItem value="dark" />
                      <span className="text-sm">dark</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-3">
                      <RadioGroupItem value="system" />
                      <span className="text-sm">system</span>
                    </label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </Button>
          {profileId && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              프로필 삭제
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
