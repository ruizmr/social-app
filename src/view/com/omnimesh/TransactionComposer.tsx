import React, { useState } from 'react';
import { View } from 'react-native';
import { useOmnimesh } from '#/lib/hooks/useOmnimesh';
import { Button } from '#/components/Button';
import { TextInput } from 'react-native';
import { Text } from '#/components/Typography';
import { useTheme } from '#/alf';
import { atoms as a } from '#/alf';
import { Loader } from '#/components/Loader';
import { Check } from '#/components/icons/Check';
import { AnimatePresence, MotiView } from 'moti';
import { ButtonText } from '#/components/Button';

// Reuse Bluesky modal, assume it's a dialog
// For simplicity, a view with fields

export function TransactionComposer({ onClose }: { onClose: () => void }) {
  const t = useTheme();
  const { submitTransaction } = useOmnimesh();
  const [draft, setDraft] = useState({ action: '', amount: 0, targetDid: '', memo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    setTxError(null);
    setTxSuccess(false);
    try {
      await submitTransaction(draft);
      setTxSuccess(true);
    } catch (e) {
      setTxError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[t.atoms.bg, a.p_lg, a.rounded_md]}>
      <Text style={[a.text_lg, a.font_bold]}>New Transaction</Text>
      <TextInput
        label="Action"
        value={draft.action}
        onChangeText={(text: string) => setDraft({ ...draft, action: text })}
      />
      <TextInput
        label="Amount"
        value={draft.amount.toString()}
        onChangeText={text => setDraft({ ...draft, amount: parseFloat(text) || 0 })}
        keyboardType="numeric"
      />
      <TextInput
        label="Target DID"
        value={draft.targetDid}
        onChangeText={text => setDraft({ ...draft, targetDid: text })}
      />
      <TextInput
        label="Memo"
        value={draft.memo}
        onChangeText={text => setDraft({ ...draft, memo: text })}
      />
      <Button label="Submit" onPress={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? <Loader size="sm" /> : <ButtonText>Submit</ButtonText>}
      </Button>
      <AnimatePresence>
        {txSuccess && <MotiView from={{ scale: 0 }} animate={{ scale: 1 }}><Check size="lg" fill="green" /></MotiView>}
      </AnimatePresence>
      {txError && <Text style={[a.mt_s3, { color: t.palette.negative_400 }]}>{txError}</Text>}
      <Button label="Cancel" onPress={onClose} variant="secondary">
        <ButtonText>Cancel</ButtonText>
      </Button>
    </View>
  );
} 