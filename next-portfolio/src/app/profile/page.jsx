"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import AvatarUpload from "@/components/AvatarUpload"

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
  avatar_url: z.string().optional(),
})

export default function ProfilePage() {
  const router = useRouter()
  const [authUser, setAuthUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profileId, setProfileId] = useState(null)
  const persistedAvatarPathRef = useRef(null)
  const pendingAvatarPathRef = useRef(null)

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      role: "",
      marketing_emails: false,
      theme: "system",
      avatar_url: "",
    },
  })

  const extractAvatarPath = useCallback((avatarUrl) => {
    if (!avatarUrl) {
      return null
    }

    if (!avatarUrl.startsWith("http")) {
      return avatarUrl
    }

    const marker = "/storage/v1/object/public/avatars/"
    const markerIndex = avatarUrl.indexOf(marker)
    if (markerIndex === -1) {
      return null
    }

    const rawPath = avatarUrl.slice(markerIndex + marker.length).split("?")[0]
    return decodeURIComponent(rawPath)
  }, [])

  const removeAvatarByPath = useCallback(async (path) => {
    if (!path) {
      return
    }

    const { error: removeError } = await supabase.storage.from("avatars").remove([path])
    if (removeError) {
      console.log(removeError)
    }
  }, [])

  const cleanupPendingAvatar = useCallback(async () => {
    if (!pendingAvatarPathRef.current) {
      return
    }

    const pathToDelete = pendingAvatarPathRef.current
    pendingAvatarPathRef.current = null
    await removeAvatarByPath(pathToDelete)
  }, [removeAvatarByPath])

  useEffect(() => {
    let isMounted = true

    async function loadAuthUser() {
      const { data, error } = await supabase.auth.getUser()
      if (!isMounted) {
        return
      }

      if (error || !data.user) {
        setAuthUser(null)
        setIsLoading(false)
        router.replace("/login")
        return
      }

      setAuthUser(data.user ?? null)
    }

    loadAuthUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return
      }

      if (!session?.user) {
        setAuthUser(null)
        router.replace("/login")
        return
      }

      setAuthUser(session.user)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    let isMounted = true

    async function loadUserData() {
      try {
        setError(null)

        const res = await fetch("/api/profiles")
        const json = await res.json()

        if (!isMounted) {
          return
        }

        if (res.status === 401) {
          router.replace("/login")
          return
        }

        if (!res.ok) {
          throw new Error(json.error || "데이터를 불러오지 못했습니다")
        }

        if (json.data) {
          form.reset(json.data)
          setProfileId(json.data.id)
          persistedAvatarPathRef.current = extractAvatarPath(json.data.avatar_url)
          pendingAvatarPathRef.current = null
        } else {
          form.reset({
            username: "",
            email: authUser?.email ?? "",
            bio: "",
            role: "",
            marketing_emails: false,
            theme: "system",
            avatar_url: "",
          })
          persistedAvatarPathRef.current = null
          pendingAvatarPathRef.current = null
        }
      } catch (error) {
        if (!isMounted) {
          return
        }

        console.log(error)
        setError(error.message || "데이터를 불러오지 못했습니다")
        toast.error("데이터를 불러오지 못했습니다")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadUserData()

    return () => {
      isMounted = false
    }
  }, [form, authUser, router])

  useEffect(() => {
    const handleBeforeUnload = () => {
      void cleanupPendingAvatar()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      void cleanupPendingAvatar()
    }
  }, [cleanupPendingAvatar])

  async function handleDelete() {
    if (!window.confirm("정말 프로필을 삭제하시겠습니까?")) {
      return
    }

    try {
      const res = await fetch("/api/profiles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId }),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "삭제에 실패했습니다")
      }

      toast.success("프로필이 삭제되었습니다")
      form.reset({
        username: "",
        email: "",
        bio: "",
        role: "",
        marketing_emails: false,
        theme: "system",
        avatar_url: "",
      })
      setProfileId(null)
      persistedAvatarPathRef.current = null
      pendingAvatarPathRef.current = null
    } catch (error) {
      console.log(error)
      toast.error("삭제 실패", {
        description: "서버에 문제가 발생했습니다. 다시 시도해주세요.",
      })
    }
  }

  async function onSubmit(values) {
    try {
      const nextProfileId = profileId ?? crypto.randomUUID();
      const previousPersistedPath = persistedAvatarPathRef.current
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: nextProfileId }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "저장에 실패했습니다");
      }

      if (!profileId) {
        setProfileId(nextProfileId);
      }

      const savedPath = extractAvatarPath(values.avatar_url)
      if (pendingAvatarPathRef.current && pendingAvatarPathRef.current === savedPath) {
        pendingAvatarPathRef.current = null
      }
      persistedAvatarPathRef.current = savedPath

      if (previousPersistedPath && savedPath && previousPersistedPath !== savedPath) {
        void removeAvatarByPath(previousPersistedPath)
      }

      toast.success(profileId ? "프로필 수정 완료!" : "프로필 생성 완료!", {
        description: `이메일: ${values.email} / 직업: ${values.role}`,
      });
    } catch (error) {
      console.log(error);
      toast.error("저장 실패", {
        description: "서버에 문제가 발생했습니다. 다시 시도해주세요.",
      });
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
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-center">
            <AvatarUpload
              url={form.watch("avatar_url")}
              size={112}
              onUpload={async (url) => {
                const newPath = extractAvatarPath(url)

                if (pendingAvatarPathRef.current && pendingAvatarPathRef.current !== newPath) {
                  await removeAvatarByPath(pendingAvatarPathRef.current)
                }

                pendingAvatarPathRef.current = newPath
                form.setValue("avatar_url", url, { shouldDirty: true, shouldTouch: true })
              }}
            />
          </div>

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
                  <Input type="email" placeholder="you@example.com" {...field} readOnly />
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
