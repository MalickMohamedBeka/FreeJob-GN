import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { useProposals } from "@/hooks/useProposals";
import { useConversation, useMessages, useSendMessage } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiProposalList } from "@/types";

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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border shrink-0">
        <p className="font-semibold">{proposal.project.title}</p>
        <p className="text-sm text-muted-foreground">
          {convData.provider.username} · {convData.client.username}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loadingMessages ? (
          <div className="flex justify-center pt-8">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-8">
            Aucun message. Commencez la conversation !
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author.id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs font-medium mb-1 opacity-70">{msg.author.username}</p>
                  )}
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-white/60" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-border shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Votre message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sendMessage.isPending}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!text.trim() || sendMessage.isPending}
          >
            {sendMessage.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
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

  // Client sees proposals for their projects — filter for active ones
  const conversableStatuses = ["CONFIRMED", "SELECTED", "SHORTLISTED", "PENDING"];
  const proposals = (data?.results ?? []).filter(
    (p) => conversableStatuses.includes(p.status)
  );

  return (
    <DashboardLayout userType="client">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Communiquez avec vos prestataires</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4" style={{ height: "calc(100vh - 200px)" }}>
          {/* Proposals List */}
          <Card className="overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-muted-foreground" size={24} />
              </div>
            ) : proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <MessageSquare size={40} className="mb-3" />
                <p className="text-sm">Aucune conversation disponible.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {proposals.map((proposal) => (
                  <button
                    key={proposal.id}
                    className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                      selectedProposal?.id === proposal.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm line-clamp-1 flex-1">
                        {proposal.project.title}
                      </p>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {proposal.status_display}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Prestataire: {proposal.provider.username}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(proposal.updated_at).toLocaleDateString("fr-FR")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Conversation */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            {selectedProposal ? (
              <ConversationPanel proposal={selectedProposal} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageSquare size={48} className="mb-4 opacity-30" />
                <p className="text-sm">Sélectionnez une conversation</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientMessages;
