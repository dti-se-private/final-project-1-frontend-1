"use client"
import React from "react";
import {useAccountAddress} from "@/src/hooks/useAccountAddress";
import {
    Button,
    getKeyValue,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import {AccountAddressResponse} from "@/src/stores/apis/addressApi";
import {useRouter} from "next/navigation";
import * as wkx from "wkx";
import Json from "@/src/components/Json"

export default function Page() {
    const {accountAddressState, accountAddressApiResult, setPage} = useAccountAddress();
    const router = useRouter();

    const rowMapper = (item: AccountAddressResponse, key: string): any => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-4">
                    <Button
                        color="primary"
                        onPress={() => router.push(`/addresses/${item.id}`)}
                    >
                        Details
                    </Button>
                    <Button
                        color="danger"
                    >
                        Delete
                    </Button>
                </div>
            );
        }

        if (key === "location") {
            const wkbBuffer = new Buffer(item.location, 'hex')
            const geometry = wkx.Geometry.parse(wkbBuffer);
            const geoJson = geometry.toGeoJSON() as {type: string, coordinates: number[]}
            const point = {
                "x": geoJson.coordinates![0],
                "y": geoJson.coordinates![1],
            }
            return <Json value={point}/>
        }

        return String(getKeyValue(item, key));
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center min-h-[55vh]">
                <h1 className="mb-8 text-4xl font-bold">Address</h1>
                <Table
                    className="w-3/4"
                    bottomContent={
                        accountAddressState.currentPage > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={accountAddressState.currentPage}
                                    total={Infinity}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        ) : null
                    }
                >
                    <TableHeader>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="name">Name</TableColumn>
                        <TableColumn key="address">Address</TableColumn>
                        <TableColumn key="location">Location</TableColumn>
                        <TableColumn key="isPrimary">Is Primary</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={accountAddressApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={accountAddressApiResult.isLoading ? "loading" : "idle"}
                    >
                        {(item) => (
                            <TableRow key={item?.name}>
                                {(columnKey) => <TableCell>{rowMapper(item, String(columnKey))}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}