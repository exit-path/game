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
      elem.scrollHeight - elem.scrollTop <= elem.clientHeight + 1;
    console.log(isAtBottom.current);
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
        <button className={styles.action} type="submit" title="send">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
        <button
          className={styles.action}
          type="button"
          title="clear"
          onClick={onClear}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </form>
    </div>
  );
});
