import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageSquare, ExternalLink } from "lucide-react";
import { useProposals } from "@/hooks/useProposals";
import { useConversation, useMessages, useSendMessage } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiProposalList } from "@/types";

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({
  user,
  size = "md",
  className = "",
}: {
  user: { username: string; profile_picture?: string | null };
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "sm" ? "w-7 h-7 text-[11px]"
    : size === "lg" ? "w-10 h-10 text-sm"
    : "w-9 h-9 text-sm";

  const initial = (user.username ?? "?").charAt(0).toUpperCase();

  if (user.profile_picture) {
    return (
      <img
        src={user.profile_picture}
        alt={user.username}
        className={`${dims} rounded-full object-cover flex-shrink-0 ring-1 ring-border ${className}`}
      />
    );
  }
  return (
    <div
      className={`${dims} rounded-full bg-primary/12 text-primary font-semibold flex items-center justify-center flex-shrink-0 ring-1 ring-primary/20 ${className}`}
    >
      {initial}
    </div>
  );
}

// ── Conversation Panel ────────────────────────────────────────────────────────

function ConversationPanel({ proposal }: { proposal: ApiProposalList }) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { data: convData, isLoading: loadingConv } = useConversation(proposal.id);
  const conversationId = convData?.id ?? "";

  const { data: messagesData, isLoading: loadingMessages } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);

  const messages = messagesData?.results ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !conversationId) return;
    setText("");
    await sendMessage.mutateAsync(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loadingConv) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (!convData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Pas de conversation pour cette proposition.
      </div>
    );
  }

  // Le client discute toujours avec le provider
  const { provider } = convData;

  const providerProfileUrl =
    provider.provider_kind === "AGENCY"
      ? `/agencies/${provider.provider_profile_id}`
      : `/freelancers/${provider.provider_profile_id}`;

  const canLinkProfile = !!provider.provider_profile_id;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="px-5 py-3 border-b border-border shrink-0 bg-white">
        <div className="flex items-center gap-3">
          {/* Avatar du provider — cliquable vers son profil public */}
          {canLinkProfile ? (
            <Link to={providerProfileUrl} className="hover:opacity-80 transition-opacity">
              <Avatar user={provider} size="lg" />
            </Link>
          ) : (
            <Avatar user={provider} size="lg" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-[0.9rem] text-foreground leading-tight truncate">
                {provider.username}
              </p>
              {canLinkProfile && (
                <Link
                  to={providerProfileUrl}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink size={12} />
                </Link>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {proposal.project.title}
            </p>
          </div>

          <Badge variant="outline" className="text-[10px] shrink-0">
            {proposal.status_display}
          </Badge>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-muted/15">
        {loadingMessages ? (
          <div className="flex justify-center pt-10">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <MessageSquare size={28} className="opacity-25" />
            <p className="text-sm">Aucun message. Commencez la conversation !</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author.id === user?.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col gap-1 max-w-[70%] ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white text-foreground rounded-bl-none border border-border/50 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  <span className="text-[10px] text-muted-foreground px-1">
                    {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-5 py-3 border-t border-border shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <Avatar
            user={{ username: user?.username ?? "?", profile_picture: null }}
            size="sm"
          />
          <Input
            placeholder="Votre message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendMessage.isPending}
            className="flex-1 bg-muted/40 border-border/60 focus:bg-white text-sm"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!text.trim() || sendMessage.isPending}
            className="shrink-0"
          >
            {sendMessage.isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ClientMessages = () => {
  const [selectedProposal, setSelectedProposal] = useState<ApiProposalList | null>(null);
  const { data, isLoading } = useProposals();

  const conversableStatuses = ["CONFIRMED", "SELECTED", "SHORTLISTED", "PENDING"];
  const proposals = (data?.results ?? []).filter((p) =>
    conversableStatuses.includes(p.status)
  );

  return (
    <DashboardLayout userType="client">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Messages</h1>
          <p className="text-muted-foreground text-sm">Communiquez avec vos prestataires</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4" style={{ height: "calc(100vh - 200px)" }}>

          {/* ── Liste des conversations ── */}
          <Card className="overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 border-b border-border bg-muted/30 shrink-0">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Conversations
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-muted-foreground" size={22} />
                </div>
              ) : proposals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center gap-2">
                  <MessageSquare size={32} className="opacity-30" />
                  <p className="text-sm font-medium">Aucune conversation</p>
                  <p className="text-xs opacity-60">
                    Les conversations apparaissent après réception de propositions.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {proposals.map((proposal) => {
                    const isActive = selectedProposal?.id === proposal.id;
                    return (
                      <button
                        key={proposal.id}
                        className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/40 ${
                          isActive
                            ? "bg-primary/5 border-l-2 border-primary"
                            : "border-l-2 border-transparent"
                        }`}
                        onClick={() => setSelectedProposal(proposal)}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Avatar initiale du provider */}
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                            {proposal.provider.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1 mb-0.5">
                              <p className="font-medium text-sm leading-snug truncate flex-1">
                                {proposal.provider.username}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-[10px] shrink-0 ml-1 leading-none"
                              >
                                {proposal.status_display}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {proposal.project.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {new Date(proposal.updated_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* ── Conversation active ── */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            {selectedProposal ? (
              <ConversationPanel proposal={selectedProposal} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                  <MessageSquare size={28} className="opacity-25" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Sélectionnez une conversation</p>
                  <p className="text-xs mt-0.5 opacity-60">
                    Choisissez un prestataire dans la liste
                  </p>
                </div>
              </div>
            )}
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientMessages;
