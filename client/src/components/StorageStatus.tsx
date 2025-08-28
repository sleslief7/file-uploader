import { useAuth } from '@/hooks/useAuth';
import useStorage from '@/hooks/useStorage';
import { Box, FormatByte, Progress, Stat } from '@chakra-ui/react';

const StorageStatus = () => {
  const { user } = useAuth();
  const { storage, isPending } = useStorage(user?.id!);

  return (
    <Box width='100%' px='2'>
      <Stat.Root>
        <Stat.Label>Storage</Stat.Label>
        <Progress.Root
          value={isPending ? null : storage.usedStorage}
          max={storage.total}
          variant='subtle'
          size='sm'
          width='90%'
          colorPalette='primary'
        >
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <Stat.HelpText>
          <FormatByte value={storage.usedStorage} /> of{' '}
          <FormatByte value={storage.total} /> used
        </Stat.HelpText>
      </Stat.Root>
    </Box>
  );
};

export default StorageStatus;
