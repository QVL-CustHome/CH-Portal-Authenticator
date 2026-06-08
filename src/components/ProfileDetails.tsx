import { DescriptionList, useTranslation } from "@custhome/ui";
import type { ReactNode } from "react";
import type { Me } from "../api/auth";

interface ProfileDetailsProps {
  me: Me;
}

export default function ProfileDetails({ me }: ProfileDetailsProps) {
  const { t } = useTranslation();

  const rolesValue: ReactNode =
    me.roles.length === 0 ? (
      <em>{t("auth.account.noRoles")}</em>
    ) : (
      <ul>
        {me.roles.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>
    );

  return (
    <DescriptionList
      items={[
        { label: t("auth.account.name"), value: me.name },
        { label: t("auth.account.email"), value: me.email },
        { label: t("auth.account.roles"), value: rolesValue },
        {
          label: t("auth.account.createdAt"),
          value: new Date(me.created_at).toLocaleDateString("fr-FR"),
        },
      ]}
    />
  );
}
