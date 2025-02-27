import ProfileLayout from "../../components/ProfileLayout";

export default function ProfilePage({
  params,
}: {
  params: { address: string };
}): JSX.Element {
  return <ProfileLayout address={params.address} title="Profile" />;
}
