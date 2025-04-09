export const SecureInput = ({ value, onChange }) => {
  const secureUpdate = (e) => {
    const securedValue = DOMPurify.sanitize(e.target.value);
    onChange(Security.cleanInput(securedValue));
  };

  return (
    <input 
      value={value}
      onChange={secureUpdate}
      data-security-scope="user-input"
    />
  );
};
