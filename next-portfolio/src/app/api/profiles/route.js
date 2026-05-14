import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request) {
	const { data, error } = await supabase.from("profiles3").select("*").limit(1).single()

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ data })
}

export async function POST(request) {
	try {
		const body = await request.json()
		const { data, error } = await supabase.from("profiles3").upsert(body).select()

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
		const { id } = await request.json();
		if (!id) {
			return NextResponse.json({ error: "id 값이 필요합니다." }, { status: 400 });
		}
		const { error } = await supabase.from("profiles3").delete().eq("id", id);
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
