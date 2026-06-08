import { Button, Feedback, PageContent, Spinner, useTranslation } from "@custhome/ui";
import ProfileDetails from "../components/ProfileDetails";
import { useAccount } from "../hooks/useAccount";

export default function Account() {
  const { t } = useTranslation();
  const { me, error, signOut } = useAccount();

  return (
    <PageContent title={t("auth.account.title")}>
      {error ? (
        <Feedback error={error} />
      ) : !me ? (
        <Spinner label={t("auth.loading")} />
      ) : (
        <>
          <ProfileDetails me={me} />
          <Button variant="secondary" onClick={signOut}>
            {t("auth.account.logout")}
          </Button>
        </>
      )}
    </PageContent>
  );
}
