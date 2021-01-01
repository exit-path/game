import React, { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import cn from "classnames";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { ChatMessage } from "../../models/multiplayer";
import { MultiplayerStore } from "../../store/multiplayer";
import styles from "./ChatPane.module.scss";

interface MessageProps {
  message: ChatMessage;
}

const Message = observer<MessageProps>(function Message(props) {
  const { sender, senderColor, text, textColor } = props.message;

  const senderStyle = React.useMemo(
    () => ({ color: "#" + senderColor.toString(16).padStart(6, "0") }),
    [senderColor]
  );

  const textStyle = React.useMemo(
    () => ({ color: "#" + textColor.toString(16).padStart(6, "0") }),
    [textColor]
  );

  return (
    <li className={styles.entry}>
      {sender === "@SYSTEM" ? null : (
        <>
          <span style={senderStyle}>{sender}</span>
          {": "}
        </>
      )}
      <span style={textStyle}>{text}</span>
    </li>
  );
});

interface MessageListProps {
  multiplayer: MultiplayerStore;
}

const MessageList = observer<MessageListProps>(function MessageList(props) {
  const { multiplayer } = props;

  const isAtBottom = useRef(true);
  const listElem = useRef<HTMLUListElement>(null);
  const onScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const elem = e.currentTarget;
    isAtBottom.current =
      elem.scrollHeight - elem.scrollTop === elem.clientHeight;
  }, []);

  const length = multiplayer.messages.length;
  useEffect(() => {
    if (length > 0) {
      if (listElem.current && isAtBottom.current) {
        listElem.current.scrollTop = listElem.current.scrollHeight;
      }
    } else {
      isAtBottom.current = true;
    }
  }, [length]);

  return (
    <ul className={styles.messages} onScroll={onScroll} ref={listElem}>
      {multiplayer.messages.map((msg, i) => (
        <Message key={i} message={msg} />
      ))}
    </ul>
  );
});

interface FormData {
  message: string;
}

export interface ChatPaneProps {
  className?: string;
  multiplayer: MultiplayerStore;
}

export const ChatPane = observer<ChatPaneProps>(function RoomPane(props) {
  const { className, multiplayer } = props;

  const { register, handleSubmit, reset } = useForm<FormData>();

  const onFormSubmit = useCallback(
    (data: FormData) => {
      multiplayer.sendMessage(data.message);
      reset();
    },
    [multiplayer, reset]
  );

  const onClear = useCallback(
    () => runInAction(() => (multiplayer.messages.length = 0)),
    [multiplayer]
  );

  return (
    <div className={cn(className, styles.pane)}>
      <MessageList multiplayer={multiplayer} />
      <form
        className={styles.bar}
        noValidate
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <input
          name="message"
          className={styles.input}
          autoComplete="off"
          ref={register({ required: true })}
        />
        <button className={styles.action} type="submit">
          Send
        </button>
        <button className={styles.action} type="button" onClick={onClear}>
          Clear
        </button>
      </form>
    </div>
  );
});
