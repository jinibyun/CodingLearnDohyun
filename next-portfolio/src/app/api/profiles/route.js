import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request) {
	const { data, error } = await supabase.from("profiles3").select("*").limit(1).single()

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ data })
}
