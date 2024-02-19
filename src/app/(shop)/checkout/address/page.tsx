import { auth } from "@/auth";
import { AddressForm, Title } from "@/components";
import { getCountries, getUserAddress } from "@/server-actions";

const AddressPage = async () => {
  const session = await auth();

  const countries = await getCountries();

  const userAddress = (await getUserAddress(session?.user.id!)) || undefined;

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm countries={countries} userStoredAddress={userAddress} />
      </div>
    </div>
  );
};

export default AddressPage;
