import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

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
		const payload = {
			...body,
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

		const { id } = await request.json();
		if (!id) {
			return NextResponse.json({ error: "id 값이 필요합니다." }, { status: 400 });
		}
		const { error } = await supabase
			.from("profiles3")
			.delete()
			.eq("id", id)
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
