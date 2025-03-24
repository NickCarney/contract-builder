import * as React from "react";

interface EmailTemplateProps {
  songName: string;
  cid: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  songName,
}) => (
  <div>
    <p>A contract has been created for the song: {songName}!</p>
  </div>
);
