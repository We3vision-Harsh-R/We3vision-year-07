"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminIcon } from "@/components/admin/admin-icons";
import { ADMIN_GROUPS, isItemActive } from "@/components/admin/admin-menu";
import type { AdminBadges } from "@/lib/admin-badges";

// The sidebar of the admin panel: the menu items sit in categories (admin-menu.ts). A category can be folded; the one that holds the open screen
// is always shown. The look is in styles/admin-shell.css (.ads-*).
export function AdminNav({ badges }: { badges: AdminBadges }) {
  const pathname = usePathname();
  const [folded, setFolded] = useState<Record<string, boolean>>({});

  return (
    <nav aria-label="Admin" className="ads-nav">
      {ADMIN_GROUPS.map((group) => {
        const hasActive = group.items.some((item) => isItemActive(item, pathname));
        const single = group.items.length === 1 && group.id === "overview";
        const open = hasActive || !folded[group.id];
        return (
          <div key={group.id} className="ads-group">
            {!single && (
              <button type="button" className="ads-group-head" aria-expanded={open} onClick={() => setFolded((f) => ({ ...f, [group.id]: open }))}>
                <span>{group.title}</span>
                <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true" data-open={open}>
                  <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <div className="ads-group-body" data-open={single || open}>
              <div>
                {group.items.map((item) => {
                  const active = isItemActive(item, pathname);
                  const count = item.badge ? badges[item.badge.key] : 0;
                  return (
                    <Link key={item.href} href={item.href} className="ads-link" aria-current={active ? "page" : undefined} tabIndex={single || open ? 0 : -1}>
                      <AdminIcon name={item.icon} size={19} />
                      <span className="ads-link-name">{item.label}</span>
                      {item.badge && count > 0 && (
                        <span className="ads-badge" data-tone={item.badge.tone}>
                          {count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
