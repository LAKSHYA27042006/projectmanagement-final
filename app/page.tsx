import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FolderKanban, ListTodo } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">ProjectHub</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Manage Your Projects with{" "}
              <span className="gradient-text">Ease</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              A simple and powerful project management tool to help you organize tasks, 
              track progress, and collaborate with your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="btn-3d">
                <Link href="/auth/sign-up">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card-3d p-6 rounded-xl border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FolderKanban className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Project Organization</h3>
              <p className="text-muted-foreground text-sm">
                Create and organize projects with customizable statuses and descriptions.
              </p>
            </div>
            <div className="card-3d p-6 rounded-xl border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Task Management</h3>
              <p className="text-muted-foreground text-sm">
                Break down projects into tasks with priorities, due dates, and status tracking.
              </p>
            </div>
            <div className="card-3d p-6 rounded-xl border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Monitor your progress and keep track of completed tasks and milestones.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with Supabase and Next.js
        </div>
      </footer>
    </div>
  )
}
