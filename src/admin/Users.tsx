import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { Shield, ShieldAlert, UsersRound } from "lucide-react";
import { TableSkeleton } from "../components/Skeleton";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";

export default function Users() {
  const users = useQuery(api.users.listUsers, {});
  const updateRole = useMutation(api.users.setRole);
  const { showToast, toast } = useToast();

  async function handleRoleChange(id: string, role: "admin" | "employee") {
    try {
      await updateRole({ id: id as Id<"users">, role });
      showToast("تم تحديث الصلاحية");
    } catch (err) {
      showToast("فشل تحديث الصلاحية", "error");
      console.error(err);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 text-right">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2">إدارة المستخدمين</h2>
          <p className="text-on-surface-variant">التحكم بصلاحيات المستخدمين</p>
        </div>

        {!users ? (
          <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden">
            <TableSkeleton rows={4} />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UsersRound size={48} className="text-outline-variant mb-4" />
            <h3 className="text-xl font-bold mb-2">لا يوجد مستخدمون</h3>
            <p className="text-on-surface-variant">لم يتم تسجيل أي مستخدمين في النظام بعد</p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-right" dir="rtl">
                <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest">
                  <tr>
                    <th className="py-4 px-6 font-normal">الاسم</th>
                    <th className="py-4 px-6 font-normal">المعرف</th>
                    <th className="py-4 px-6 font-normal">الصلاحية</th>
                    <th className="py-4 px-6 font-normal">تعديل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 flex-row-reverse">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
                            {u.name?.[0] || "م"}
                          </div>
                          <span className="text-sm font-medium">{u.name || "بدون اسم"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-on-surface-variant font-mono">{u.tokenIdentifier.slice(0, 20)}...</td>
                      <td className="py-4 px-6">
                        <span className={`flex items-center gap-2 text-xs font-bold ${u.role === "admin" ? "text-primary" : "text-on-surface-variant"}`}>
                          {u.role === "admin" ? <Shield size={14} /> : <ShieldAlert size={14} />}
                          {u.role === "admin" ? "مدير" : "موظف"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <select value={u.role} aria-label="تغيير صلاحية المستخدم" onChange={(e) => handleRoleChange(u._id, e.target.value as "admin" | "employee")}
                          className="border border-outline-variant rounded-full px-3 py-1.5 text-xs font-bold bg-transparent focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98] transition-[background-color,transform]">
                          <option value="admin">مدير</option>
                          <option value="employee">موظف</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Toast toast={toast} />
      </div>
    </AdminLayout>
  );
}
