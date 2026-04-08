import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin — Kullanıcılar" };

export default async function AdminUsersPage() {
  const supabase = await createAdminClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Kullanıcılar ({users?.length ?? 0})
      </h1>

      <div className="rounded-2xl border border-border bg-brand-surface/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-brand-elevated/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Kullanıcı</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Kredi</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Kayıt Tarihi</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(users ?? []).map((user) => (
              <tr key={user.id} className="hover:bg-brand-elevated/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{user.full_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="font-semibold text-brand-gold">{user.credits} kr</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-4 py-3">
                  {user.is_admin ? (
                    <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  ) : (
                    <span className="text-xs bg-brand-surface text-muted-foreground px-2 py-1 rounded-full border border-border">
                      Kullanıcı
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
