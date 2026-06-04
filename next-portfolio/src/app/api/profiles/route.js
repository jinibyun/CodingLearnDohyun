import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

function extractAvatarPath(avatarUrl) {
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
}

export async function GET(request) {
	const supabase = await createSupabaseServerClient()
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
	}
	if (!user) {
		return NextResponse.json({ error: "인증은 됐는데 User 가 없습니다." }, { status: 401 })
	}

	const { data, error } = await supabase
		.from("profiles3")
		.select("*")
		.eq("email", user.email)
		.maybeSingle()

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ data })
}

export async function POST(request) {
	try {
		const supabase = await createSupabaseServerClient()
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
		}

		const body = await request.json()
		const {
			id,
			name,
			username,
			bio,
			role,
			marketing_emails,
			theme,
			avatar_url,
		} = body

		const payload = {
			id,
			name,
			username,
			bio,
			role,
			marketing_emails,
			theme,
			avatar_url,
			email: user.email,
		}

		const { data, error } = await supabase.from("profiles3").upsert(payload).select()

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		return NextResponse.json({ data }, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ error: error.message || "요청 처리 중 오류가 발생했습니다." },
			{ status: 500 }
		)
	}
}

export async function DELETE(request) {
	try {
		const supabase = await createSupabaseServerClient()
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
		}

		const { data: existingProfile, error: findError } = await supabase
			.from("profiles3")
			.select("id, avatar_url")
			.eq("email", user.email)
			.maybeSingle()

		if (findError) {
			return NextResponse.json({ error: findError.message }, { status: 500 })
		}

		if (!existingProfile) {
			return NextResponse.json({ success: true }, { status: 200 })
		}

		const avatarPath = extractAvatarPath(existingProfile.avatar_url)
		if (avatarPath) {
			const { error: removeError } = await supabase.storage.from("avatars").remove([avatarPath])
			if (removeError) {
				return NextResponse.json({ error: removeError.message }, { status: 500 })
			}
		}

		const { error } = await supabase
			.from("profiles3")
			.delete()
			.eq("id", existingProfile.id)
			.eq("email", user.email);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: error.message || "요청 처리 중 오류가 발생했습니다." },
			{ status: 500 }
		);
	}
}
