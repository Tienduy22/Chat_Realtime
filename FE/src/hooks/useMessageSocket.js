import { useEffect, useCallback } from "react";

export function useMessageSocket(
    socket,
    conversationId,
    currentUserId,
    setMessages,
) {
    // NEW MESSAGE
    useEffect(() => {
        if (!socket || !conversationId || isNaN(conversationId)) return;

        const handleNewMessage = (data) => {
            if (Number(data.conversation_id) !== conversationId) return;
            if (!data.messages || data.messages.length === 0) return;

            const senderInfo = data.sender?.user_id
                ? {
                      user_id: data.sender.user_id,
                      full_name: data.sender.full_name || "",
                      avatar_url: data.sender.avatar_url || "",
                  }
                : null;

            const realMessages = data.messages
                .filter((msg) => msg && msg.message_id)
                .map((msg) => ({
                    ...msg,
                    sender: senderInfo || { user_id: msg.sender_id },
                    isPending: false,
                }));

            setMessages((prev) => {
                const pendingIndices = [];
                for (let i = prev.length - 1; i >= 0; i--) {
                    if (prev[i].isPending) pendingIndices.unshift(i);
                    else break;
                }

                if (
                    pendingIndices.length === realMessages.length &&
                    pendingIndices.length > 0
                ) {
                    const updated = [...prev];
                    pendingIndices.forEach(
                        (idx, i) => (updated[idx] = realMessages[i]),
                    );
                    return updated;
                } else {
                    // Tin nhắn mới từ người khác
                    const existingIds = new Set(prev.map((m) => m.message_id));
                    const newMsgs = realMessages.filter(
                        (msg) => !existingIds.has(msg.message_id),
                    );
                    if (newMsgs.length === 0) return prev;
                    return [...prev, ...newMsgs];
                }
            });
        };

        socket.on("new_message", handleNewMessage);
        return () => socket.off("new_message", handleNewMessage);
    }, [socket, conversationId, setMessages]);

    // REACTION
    const handleAddReaction = useCallback(
        (data) => {
            if (Number(data.conversation_id) !== conversationId) return;

            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg.message_id !== data.message_reaction) return msg;

                    const oldReactions = msg.reactions || [];
                    const alreadyExists = oldReactions.some(
                        (r) =>
                            r.user_id === data.user_id &&
                            r.emoji === data.emoji,
                    );

                    if (alreadyExists) return msg;

                    return {
                        ...msg,
                        reactions: [
                            ...oldReactions,
                            {
                                reaction_id: data.reaction_id,
                                user_id: data.user_id,
                                emoji: data.emoji,
                            },
                        ],
                    };
                }),
            );
        },
        [conversationId, setMessages],
    );

    // REMOVE REACTION
    const handleRemoveReaction = useCallback(
        (data) => {
            if (Number(data.conversation_id) !== conversationId) return;

            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg.message_id !== data.message_reaction) return msg;

                    return {
                        ...msg,
                        reactions: (msg.reactions || []).filter(
                            (r) =>
                                !(
                                    r.user_id === data.user_id &&
                                    r.emoji === data.emoji
                                ),
                        ),
                    };
                }),
            );
        },
        [conversationId, setMessages],
    );

    // MESSAGE EDITED
    const handleMessageEdited = useCallback(
        (data) => {
            console.log("OK", data)
            if (Number(data.conversation_id) !== conversationId) return;
            if (!data.message_edit || !data.content) return;
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.message_id === data.message_edit
                        ? {
                              ...msg,
                              content: data.content,
                              is_edited: true,
                              edited_at:
                                  data.edited_at || new Date().toISOString(),
                          }
                        : msg,
                ),
            );
        },
        [conversationId, setMessages],
    );
  
    useEffect(() => {
        if (!socket) return;

        socket.on("reaction_message", handleAddReaction);
        socket.on("remove_reaction_message", handleRemoveReaction);
        socket.on("edit_message", handleMessageEdited);

        return () => {
            socket.off("reaction_message", handleAddReaction);
            socket.off("remove_reaction_message", handleRemoveReaction);
            socket.off("edit_message", handleMessageEdited);
        };
    }, [socket, handleAddReaction, handleRemoveReaction, handleMessageEdited]);
}
