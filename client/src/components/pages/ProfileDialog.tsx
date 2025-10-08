import React, { useState, useRef } from 'react';
import {
  Dialog,
  Button,
  Input,
  Flex,
  Center,
  Text,
  Box,
  Portal,
} from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import type { User } from '@/interfaces/UserInterface';

export interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [name, setName] = useState<string>(user?.name || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    user?.profileImgUrl
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const resetInputs = (incomingUser: User) => {
    setName(incomingUser?.name || '');
    setProfileImage(null);
    setPreviewUrl(incomingUser?.profileImgUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async () => {
    const updateData: { name?: string; profileImage?: File } = {};

    if (name !== user?.name) {
      updateData.name = name;
    }

    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    if (Object.keys(updateData).length > 0) {
      updateProfile(updateData, {
        onSuccess: (user) => {
          onOpenChange(false);
          resetInputs(user);
        },
      });
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size='md'
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Profile Settings</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Flex direction='column' gap={6}>
                <Flex direction='column' align='center' mb={6}>
                  <Box
                    width='120px'
                    height='120px'
                    borderRadius='full'
                    overflow='hidden'
                    mb={4}
                    bg='gray.100'
                  >
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt={user?.name || 'Profile'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    {!previewUrl && user?.name && (
                      <Center height='100%'>
                        <Text fontSize='3xl'>{user.name.charAt(0)}</Text>
                      </Center>
                    )}
                  </Box>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </Button>
                  <input
                    type='file'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept='image/*'
                    onChange={handleFileChange}
                  />
                </Flex>

                <Flex direction='column' gap={2}>
                  <Text fontWeight='medium'>Name</Text>
                  <Input
                    value={name}
                    onChange={handleNameChange}
                    placeholder='Your name'
                  />
                </Flex>

                <Flex direction='column' gap={2}>
                  <Text fontWeight='medium'>Email</Text>
                  <Input
                    value={user?.email || ''}
                    readOnly
                    placeholder='Email not set'
                    bg='gray.50'
                  />
                </Flex>
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline' onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette='blue'
                onClick={handleSubmit}
                loading={isPending}
                loadingText='Saving'
                disabled={name === user?.name && !profileImage}
              >
                Save Changes
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileDialog;
