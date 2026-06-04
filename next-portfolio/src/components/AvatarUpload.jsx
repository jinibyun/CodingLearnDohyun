"use client"

import { useRef, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AvatarUpload({ url, size = 120, onUpload }) {
	const [uploading, setUploading] = useState(false)
	const fileInputRef = useRef(null)

	const uploadAvatar = async (event) => {
		try {
			setUploading(true)

			const file = event.target.files?.[0]
			if (!file) {
				return
			}

			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser()

			if (userError || !user) {
				alert("로그인 사용자 정보를 확인할 수 없습니다.")
				return
			}

			const fileExt = file.name.split(".").pop()
			const fileName = `${user.id}-${Math.random()}.${fileExt}`

			const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file)

			if (uploadError) {
				alert(uploadError.message)
				return
			}

			const {
				data: { publicUrl },
			} = supabase.storage.from("avatars").getPublicUrl(fileName)

			onUpload(publicUrl)
		} catch (error) {
			alert(error.message || "아바타 업로드 중 오류가 발생했습니다.")
		} finally {
			setUploading(false)
			if (fileInputRef.current) {
				fileInputRef.current.value = ""
			}
		}
	}

	return (
		<div className="inline-block">
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={uploadAvatar}
				className="hidden"
			/>

			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				className="relative overflow-hidden rounded-full border border-slate-300"
				style={{ width: size, height: size }}
				disabled={uploading}
				aria-label="프로필 이미지 업로드"
			>
				{url ? (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img
						src={url}
						alt="프로필 이미지"
						className="h-full w-full object-cover"
						style={{ opacity: uploading ? 0.4 : 1 }}
					/>
				) : (
					<div
						className="h-full w-full bg-slate-300"
						style={{ opacity: uploading ? 0.4 : 1 }}
					/>
				)}

				{uploading ? (
					<div className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs font-medium text-white">
						업로드 중...
					</div>
				) : null}
			</button>
		</div>
	)
}
