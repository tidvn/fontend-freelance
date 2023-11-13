import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import Avatar from "boring-avatars";
import { useEffect, useState } from "react";
import { components } from "react-select";
import AsyncSelect from "react-select/async";

import type { CompanyType } from "@/interface/company";
import { userStore } from "@/store/user";
import fetchClient from "@/lib/fetch-client";

interface CompanyOptionType extends CompanyType {
  role?: string;
}

interface CompanyOption {
  value: number;
  label: string;
  company: CompanyOptionType;
}

function SelectCompany() {
  const { setUserInfo, userInfo } = userStore();
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(
    null
  );

  useEffect(() => {
    
    if (userInfo?.currentCompany?.id) {
      setSelectedCompany({
        value: userInfo?.currentCompany?.id,
        label: userInfo?.currentCompany?.name,
        company: userInfo?.currentCompany,
      });
    }
  }, [userInfo]);


  const loadCompanies = (
    inputValue: string,
    callback: (options: CompanyOption[]) => void
  ) => {
    fetchClient({
      method: "POST",
      endpoint: "/api/company/list",
      body: JSON.stringify({
        userId: userInfo?.id,
        searchString: inputValue,
      }),
    }).then((response) => {
      const options = [...(response?.data || [])];
      callback(options);
    });
  };

  const updateUser = async (companyId: string) => {
    try {
      const userUpdatedDetails = await fetchClient({
        method: "POST",
        endpoint: "/api/user/update",
        body: JSON.stringify({ id: userInfo?.id, currentCompanyId: companyId }),
      });
      
      return userUpdatedDetails.data;
    } catch (error) {
      return userInfo;
    }
  };

  const handleChange = async (option?: any) => {
    const newUser = await updateUser(option.value);
    setUserInfo(newUser);
  };

  const SingleValue = (props: any) => {
    const { data } = props;
    return (
      <components.SingleValue {...props}>
        <Flex align="center" py={1}>
          {data?.company?.logo ? (
            <Image
              boxSize="32px"
              borderRadius="full"
              alt={data?.company?.name}
              src={data?.company?.logo}
            />
          ) : (
            <Avatar
              name={data?.company?.name}
              colors={["#92A1C6", "#F0AB3D", "#C271B4"]}
              size={32}
              variant="marble"
            />
          )}
          <Box display={{ base: "none", md: "block" }} ml={2}>
            <Text color="brand.slate.800" fontSize="sm">
              {data?.company?.name}
            </Text>
            <Text color="brand.slate.400" fontSize="xs">
              {data?.company?.role}
            </Text>
          </Box>
        </Flex>
      </components.SingleValue>
    );
  };

  const Option = (props: any) => {
    const { data } = props;
    return (
      <components.Option {...props}>
        <Flex align="center">
          {data?.company?.logo ? (
            <Image
              boxSize="32px"
              borderRadius="full"
              alt={data?.company?.name}
              src={data?.company?.logo}
            />
          ) : (
            <Avatar
              name={data?.company?.name}
              colors={["#92A1C6", "#F0AB3D", "#C271B4"]}
              size={32}
              variant="marble"
            />
          )}
          <Box display={{ base: "none", md: "block" }} ml={2}>
            <Text color="brand.slate.800" fontSize="sm">
              {data?.company?.name}
            </Text>
            <Text color="brand.slate.400" fontSize="xs">
              {data?.company?.role}
            </Text>
          </Box>
        </Flex>
      </components.Option>
    );
  };

  return (
    <AsyncSelect
      components={{ SingleValue, Option }}
      value={selectedCompany}
      onChange={(e) => handleChange(e)}
      placeholder="Select Company"
      loadOptions={loadCompanies}
      defaultOptions
      isClearable={false}
      isSearchable={true}
      autoFocus={false}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          cursor: "pointer",
          fontSize: "14px",
          borderColor: "#94a3b8",
          "&:hover": {
            borderColor: "#6366F1",
          },
          minHeight: "46px",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#94a3b8",
          "&:hover": {
            color: "#94a3b8",
          },
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: "transparent",
          width: 0,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? "#e2e8f0" : "white",
          "&:hover": {
            backgroundColor: "#f1f5f9",
          },
        }),
      }}
    />
  );
}

export default SelectCompany;
