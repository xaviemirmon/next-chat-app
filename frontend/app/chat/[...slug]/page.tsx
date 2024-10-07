import Chat from "@/components/Chat";

export default function ChatPage({
  params,
}: {
  params: { slug: string[] | string };
}) {
  return <Chat target={Number(params.slug)} />;
}
