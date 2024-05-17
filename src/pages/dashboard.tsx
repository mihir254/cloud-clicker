import React, { useEffect, useMemo, useRef, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { Line } from 'react-chartjs-2';
import { RiRefreshLine } from "react-icons/ri";
import { Flex, Heading, Input, Text, useBreakpointValue } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TooltipItem } from 'chart.js';

import { db } from '@/../db/firebase';
import { useAuth } from '@/hooks/useAuth';
import { ClickInfo, ChartData } from '@/interfaces/interface';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useAuth();
    const hoursRef = useRef<HTMLInputElement>(null);
    const [hours, setHours] = useState <number> (4);
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [
            {
                label: 'Total Clicks',
                data: [],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    });

    const options = useMemo(() => ({
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: TooltipItem<'line'>) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${value} clicks at ${context.label}`;
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Clicks'
                }
            }
        }
    }), []);
    

    const getClicksPerMinute = async (): Promise<{totalClicks: Record<string, number>, userClicks: Record<string, number> }> => {
        const now = new Date();
        const fewHoursAgo = new Date(now.getTime() - (1000 * 60 * 60 * hours));
    
        const clicksRef = collection(db, "Clicks");
        const q = query(clicksRef, where("timestamp", ">=", fewHoursAgo));
    
        const querySnapshot = await getDocs(q);
        const totalClicks: Record<string, number> = {};
        const userClicks: Record<string, number> = {};
    
        querySnapshot.forEach((doc) => {
            const data = doc.data() as ClickInfo;
            const date = data.timestamp.toDate();
            date.setSeconds(0, 0);
    
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() - timezoneOffset);
            const timeKey = localDate.toISOString().slice(0, 16).replace('T', ' ');

            totalClicks[timeKey] = (totalClicks[timeKey] || 0) + 1;
            if (data.userId === user?.id) {
                userClicks[timeKey] = (userClicks[timeKey] || 0) + 1;
            }
        });
    
        return { totalClicks, userClicks }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { totalClicks, userClicks } = await getClicksPerMinute();
                const sortedKeys = Object.keys({ ...totalClicks, ...userClicks }).sort();
                const totalValues = sortedKeys.map(k => totalClicks[k] || 0);
                const userValues = sortedKeys.map(k => userClicks[k] || 0);
                setChartData({
                    labels: sortedKeys.map(key => new Date(key).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })),
                    datasets: [
                        { ...chartData.datasets[0], data: totalValues },
                        ...(user ? [{
                            label: 'Your Clicks',
                            data: userValues,
                            fill: false,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                        }] : [])
                    ]
                });
            } catch (error) {
                console.log('Failed to fetch click data', error);
            }
        };
        fetchData();
    }, [hours, user]);

    const handleOnclick = () => {
        const hoursRefValue = Number(hoursRef.current?.value || '-1');
        if (hoursRefValue < 2 || hoursRefValue > 24) {
            setHours(4);
        } else {
            setHours(hoursRefValue);
        }
        if (hoursRef.current) {
            hoursRef.current.value = '';
        }
    }

    const flexProps = useBreakpointValue({
        base: { height: "37%", mt: "150px", transform: "rotate(90deg)" },
        md: { width: "100%" },
        lg: { width: "70%" }
    });

    return (
        <Flex id='dashboard' height={"100vh"} width={"100vw"} alignItems={"center"} justifyContent={"center"} px={{base: 8, md: 12}} py={4}>
            <Flex direction={"column"} alignItems={"center"} justifyContent={{base: "flex-start", md: "center"}} gap={"35px"} height={"100%"} width={"100%"}>
                <Heading pt={8} size={{base: "lg", md: "xl"}} textAlign={"center"}>Click activity for the last <Text px={1} as={"span"} decoration={"underline"} color={"steelblue"}>{hours}</Text> hours.</Heading>
                <Flex alignItems={"center"} justifyContent={"center"} gap={"10px"}>
                    <Input px={2} textAlign={"center"} variant={"filled"} fontSize={{base: 13, md: 16}} maxWidth={{base: "100px", md: "150px"}} name='hour' placeholder='Hours (2-24)' type='number' ref={hoursRef}/>
                    <RiRefreshLine size={27} cursor={"pointer"} onClick={handleOnclick}/>
                </Flex>
                <Flex aspectRatio={2} alignItems={"center"} justifyContent={"center"} {...flexProps}>
                    <Line data={chartData} options={options}/>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Dashboard;
