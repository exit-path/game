import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { MultiplayerStore } from "../../store/multiplayer";
import styles from "./ChatPane.module.scss";

interface MessageListProps {}

const MessageList = observer<MessageListProps>(function MessageList(props) {
  return <ul className={styles.messages}></ul>;
});

interface FormData {
  message: string;
}

export interface ChatPaneProps {
  className?: string;
  multiplayer: MultiplayerStore;
}

export const ChatPane = observer<ChatPaneProps>(function RoomPane(props) {
  const { className } = props;

  const { register, handleSubmit, reset } = useForm<FormData>();

  const onFormSubmit = useCallback(
    (data: FormData) => {
      console.log(data.message);
      reset();
    },
    [reset]
  );

  return (
    <div className={cn(className, styles.pane)}>
      <MessageList />
      <form
        className={styles.bar}
        noValidate
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <input
          name="message"
          className={styles.input}
          ref={register({ required: true })}
        />
        <button className={styles.send} type="submit">
          Send
        </button>
      </form>
    </div>
  );
});
