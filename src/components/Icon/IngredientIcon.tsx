type IngredientIconProps = {
  className?: string;
};

const IngredientIcon = ({ className = '' }: IngredientIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="20"
      className={`mr-2 inline-block align-middle ${className}`}
    >
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <path
          fill="currentColor"
          d="M11.239 6.86a1.11 1.11 0 1 1-1.57 1.57 1.11 1.11 0 0 1 1.57-1.57"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m10.454 7.646 7.341-7.3M7.615 7.899H.253c-.14 0-.253 0-.253.14l1.671 9.645c0 .14.114.253.255.253h17.01c.14 0 .255-.056.255-.196l1.492-9.703c0-.14-.113-.139-.254-.139h-6.583"
        ></path>
        <path
          fill="currentColor"
          d="M4.288 8.245h3.264c.014-1.098.025-2.594.025-2.594s.028-.664-.503-1.07c-.532-.406-.504-.5-.504-.625 0-.106-.039-1.929-.037-2.857.049-.016.044-.063.044-.117V.566s.02-.282-.646-.282H5.91c-.668 0-.718.282-.718.282v.416c0 .054.03.1.08.117v2.857c0 .125.026.219-.505.625s-.504 1.07-.504 1.07.01 1.496.025 2.594m15.182-.346c-.024-1.58-1.288-2.856-2.845-2.856s-2.821 1.275-2.845 2.856z"
        ></path>
        <path
          fill="currentColor"
          d="M4.846 7.055a.844.844 0 0 1-.844.844h-2.12a.844.844 0 0 1-.844-.844v-.043c0-.466.378-.844.844-.844h2.12c.466 0 .844.378.844.844z"
        ></path>
        <rect
          width="0.857"
          height="4.714"
          x="9.429"
          y="11.143"
          fill="currentColor"
          rx="0.429"
        ></rect>
        <rect
          width="0.857"
          height="4.714"
          x="12.857"
          y="11.143"
          fill="currentColor"
          rx="0.429"
        ></rect>
        <rect
          width="0.857"
          height="4.714"
          x="6"
          y="11.143"
          fill="currentColor"
          rx="0.429"
        ></rect>
        <path
          fill="currentColor"
          d="M11.239 6.86a1.11 1.11 0 1 1-1.57 1.57 1.11 1.11 0 0 1 1.57-1.57"
        ></path>
      </g>
    </svg>
  );
};

export default IngredientIcon;
