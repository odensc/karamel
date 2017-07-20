import React from "react";
import classnames from "classnames";
import { decode } from "he";

import style from "./Author.scss";

const attrMap: { [key: string]: {
	class: string;
	letter: string;
} } = {
	admin: {
		class: style.admin,
		letter: "A"
	},
	moderator: {
		class: style.moderator,
		letter: "A"
	},
	submitter: {
		class: style.submitter,
		letter: "S"
	}
};

export const Author = ({ author, distinguished, flair, submitter, ...props }: AuthorProps) => {
	const ids = distinguished ? [distinguished] : [];
	if (submitter) ids.push("submitter");

	const attrs = ids.map(id => attrMap[id]);

	return (
		<span className={props.className || ""}>
			<a
				{...props}
				className={classnames(style.link, attrs.map(a => a.class))}
				target="_blank"
				href={`https://reddit.com/u/${author}`}
			>
				{author}
			</a>

			{flair && (
				<span className={style.flair}>
					{decode(flair)}
				</span>
			)}

			{attrs.length > 0 ? (
				<span>
					[
						{attrs.map((attr, index) => (
							<span
								key={attr.class}
								className={attr.class}
							>
								{attr.letter}
								{(index !== attrs.length - 1) && ","}
							</span>
						))}
					]
				</span>
			) : null}
		</span>
	);
};

export interface AuthorProps extends React.HTMLProps<HTMLAnchorElement> {
	author: string;
	distinguished?: string | null;
	flair?: string | null;
	submitter?: boolean;
}
