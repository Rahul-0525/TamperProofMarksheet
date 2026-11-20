"""
Ed25519 Cryptographic Signatures for VeriMark Dual-Approval Governance
Provides key generation, message signing, and signature verification.
"""

from typing import Tuple
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature


def generate_keypair() -> Tuple[str, str]:
    """
    Generates a new Ed25519 keypair.
    Returns: (hex_private_key, hex_public_key)
    """
    private_key = ed25519.Ed25519PrivateKey.generate()
    public_key = private_key.public_key()

    priv_hex = private_key.private_bytes_raw().hex()
    pub_hex = public_key.public_bytes_raw().hex()

    return priv_hex, pub_hex


def sign_message(message: str, private_key_hex: str) -> str:
    """
    Signs a UTF-8 message using an Ed25519 private key hex.
    Returns: hex-encoded 64-byte signature.
    """
    priv_bytes = bytes.fromhex(private_key_hex)
    private_key = ed25519.Ed25519PrivateKey.from_private_bytes(priv_bytes)
    
    signature_bytes = private_key.sign(message.encode("utf-8"))
    return signature_bytes.hex()


def verify_signature(message: str, signature_hex: str, public_key_hex: str) -> bool:
    """
    Verifies that signature_hex was created by the owner of public_key_hex for message.
    Returns: True if valid, False otherwise.
    """
    try:
        pub_bytes = bytes.fromhex(public_key_hex)
        public_key = ed25519.Ed25519PublicKey.from_public_bytes(pub_bytes)
        sig_bytes = bytes.fromhex(signature_hex)
        
        public_key.verify(sig_bytes, message.encode("utf-8"))
        return True
    except (InvalidSignature, ValueError):
        return False
