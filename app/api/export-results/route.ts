import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'quiz' or 'flashcard'

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let data
    if (type === "quiz") {
      const { data: results } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      data = results || []
    } else if (type === "flashcard") {
      const { data: results } = await supabase
        .from("flashcard_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      data = results || []
    } else {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }

    const csv = convertToCSV(data)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-results-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export results" }, { status: 500 })
  }
}

function convertToCSV(data: unknown[]): string {
  if (!data || data.length === 0) return ""

  const headers = Object.keys(data[0] as Record<string, unknown>)
  const rows = data.map((item: any) => headers.map((header) => JSON.stringify(item[header] ?? "")))

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}
