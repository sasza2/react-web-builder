import React from "react";
import ReactDOM from "react-dom";

import { Arrow, ArrowIn, Popup } from "./FieldPopup.styled";

type FieldPopupProps = {
	children: JSX.Element | JSX.Element[];
	closing: boolean;
	position: {
		top: number;
		left: number;
	};
	popupRef: React.MutableRefObject<HTMLDivElement>;
};

export function FieldPopup({
	children,
	closing,
	position,
	popupRef,
}: FieldPopupProps) {
	if (!position) return null;
	return ReactDOM.createPortal(
		<Popup style={position} ref={popupRef} $closing={closing}>
			<Arrow>
				<ArrowIn />
			</Arrow>
			{children}
		</Popup>,
		document.body,
	);
}
