import { DescriptionList, useTranslation } from "@custhome/ui";
import type { ReactNode } from "react";
import type { Me } from "../api/auth";

interface ProfileDetailsProps {
  me: Me;
}

export default function ProfileDetails({ me }: ProfileDetailsProps) {
  const { t } = useTranslation();

  const rolesValue: ReactNode =
    Object.keys(me.roles).length === 0 ? (
      <em>{t("auth.account.noRoles")}</em>
    ) : (
      <ul>
        {Object.entries(me.roles).map(([portal, role]) => (
          <li key={portal}>
            {portal} : {role}
          </li>
        ))}
      </ul>
    );

  return (
    <DescriptionList
      items={[
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
